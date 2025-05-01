import SamplesModel from "../models/samplesModel.js";
import UsersModel from "../models/usersModel.js";
import exportedFunctions from "../middlewares/authMiddlewares.js";
import { sseEmitter } from "../middlewares/sseEmitterMiddlewares.js";

const { whoAmI } = exportedFunctions;

class SamplesController {
    // ✅ Get all samples for a given subcollection ID
    static async getAllSamples(req, res) {
        try {
            const { subcollectionId } = req.params;
            const samples = await SamplesModel.getAllSamples(subcollectionId);
            const retSamples = [];
            for(const  sample of samples) {
                const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                const timelineList = await SamplesModel.getAllSampleTimeline(sample.id);
                const renderedTimelineList = [];
                for (const timeline of timelineList) {
                    const user = await UsersModel.getUserById(timeline.user_id);
                    timeline.user = user;
                    renderedTimelineList.push(timeline);
                }
                retSamples.push({
                    ...sample,
                    images: imageList,
                    timeline: renderedTimelineList
                });
            }
            res.json(retSamples);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSampleById(req, res) {
        try {
            const { sample_id } = req.params;

            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample_id);
            const timelineList = await SamplesModel.getAllSampleTimeline(sample_id);
            const sample = await SamplesModel.getSampleById(sample_id);

            const renderedTimelineList = [];
            for (const timeline of timelineList) {
                const user = await UsersModel.getUserById(timeline.user_id);
                timeline.user = user;
                renderedTimelineList.push(timeline);
            }
            const retSamples = {
                ...sample,
                images: imageList,
                timeline: renderedTimelineList
            }

            res.json(retSamples);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    // ✅ Create a new sample
    static async createSample(req, res) {
        try {
            const { subcollectionId, name, imageUrl } = req.body;

            const userRole = await whoAmI(req, res);
            if (userRole !== "Stylist") {
                return res.status(403).json({ error: "Access denied. Only Stylists can create samples." });
            }

            if (!subcollectionId ) {
                return res.status(400).json({ error: "Subcollection ID are required" });
            }

            if (!name || !imageUrl) {
                return res.status(400).json({ error: "Sample name and image URL are required" });
            }

            const userId = exportedFunctions.getCurrentUserID(req, res);
            const newSample = await SamplesModel.createSample(subcollectionId, name, imageUrl, userId);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'sample',
                userId: userId,
                data: newSample, 
                action: 'create',
                message: "New Sample Created"
            });
            res.status(201).json(newSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Update sample Status
    static async updateSampleStatus(req, res) {
        try {
            const { sample_id } = req.params;
            const { 
                status,
                comment
             } = req.body;

            if (!status) {
                return res.status(400).json({ error: "Status is required" });
            }
            const currentUserID = await exportedFunctions.getCurrentUserID(req, res)
            const updatedSample = await SamplesModel.editSample(sample_id, status, comment, currentUserID);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'sample',
                userId: currentUserID,
                data: updatedSample, 
                action: 'status',
                message: "Sample Status Updated"
            });
            res.json(updatedSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ✅ Get Available Samples
    static async fetchAvailableSamples(req, res) {
        try {
            const userRole = await whoAmI(req, res);
            switch (userRole) {
                case "Manager":
                    {
                        const availableSamples = await SamplesModel.getActiveSamples();
                        const result = [];
                        for (const sample of availableSamples) {
                            const currentTimeLine = await SamplesModel.getAllSampleTimeline(sample.id);
                            if(!currentTimeLine) return result;
                            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                            result.push({
                                id: sample.id,
                                subcollectionId: sample.subcollection_id,
                                isActive: sample.is_active,
                                status: currentTimeLine[0].status,
                                timeline: currentTimeLine,
                                images: imageList
                            });
                        }
                        res.json(result);
                        break;
                    }
                case "Stylist":
                    {
                        const availableSamples = await SamplesModel.getActiveSamples();
                        const result = [];
                        for (const sample of availableSamples) {
                            const currentTimeLine = await SamplesModel.getAllSampleTimeline(sample.id);
                            if(!currentTimeLine) return result;
                            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                            if(['new', 'edit', 'development_done', 'external_task_done', 'external_task'].includes(currentTimeLine[0].status)) {
                                result.push({
                                    id: sample.id,
                                    subcollectionId: sample.subcollection_id,
                                    isActive: sample.is_active,
                                    status: currentTimeLine[0].status,
                                    timeline: currentTimeLine,
                                    images: imageList
                                });
                            }
                        }
                        res.json(result);
                        break;
                    }
                case "Modelist":
                    {
                        const availableSamples = await SamplesModel.getActiveSamples();
                        const result = [];
                        for (const sample of availableSamples) {
                            const currentTimeLine = await SamplesModel.getAllSampleTimeline(sample.id);
                            if(!currentTimeLine) return result;
                            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                            if(['in_development', 'accepted', 'readjustment', 'cut_phase', 'preparing_traces'].includes(currentTimeLine[0].status)) {
                                result.push({
                                    id: sample.id,
                                    subcollectionId: sample.subcollection_id,
                                    isActive: sample.is_active,
                                    status: currentTimeLine[0].status,
                                    timeline: currentTimeLine,
                                    images: imageList
                                });
                            }
                        }
                        res.json(result);
                        break;
                    }
                case "ExecutiveWorker":
                    {
                        const availableSamples = await SamplesModel.getActiveSamples();
                        const result = [];
                        for (const sample of availableSamples) {
                            const currentTimeLine = await SamplesModel.getAllSampleTimeline(sample.id);
                            if(!currentTimeLine) return result;
                            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                            if(['in_production'].includes(currentTimeLine[0].status)) {
                                result.push({
                                    id: sample.id,
                                    subcollectionId: sample.subcollection_id,
                                    isActive: sample.is_active,
                                    status: currentTimeLine[0].status,
                                    timeline: currentTimeLine,
                                    images: imageList
                                });
                            }
                        }
                        res.json(result);
                        break;
                    }
                case "Tester":
                    {
                        const availableSamples = await SamplesModel.getActiveSamples();
                        const result = [];
                        for (const sample of availableSamples) {
                            const currentTimeLine = await SamplesModel.getAllSampleTimeline(sample.id);
                            if(!currentTimeLine) return result;
                            const imageList = await SamplesModel.getAllImagesBelongingToSample(sample.id);
                            if(['testing'].includes(currentTimeLine[0].status)) {
                                result.push({
                                    id: sample.id,
                                    subcollectionId: sample.subcollection_id,
                                    isActive: sample.is_active,
                                    status: currentTimeLine[0].status,
                                    timeline: currentTimeLine,
                                    images: imageList
                                });
                            }
                        }
                        res.json(result);
                        break;
                    }
                default:
                    res.status(403).json({ error: "Access denied. Only Logged in users can fetch available samples." });
                    break;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSampleById(req, res) {
        try {
            const { sample_id } = req.params;
            const deletedSample = await SamplesModel.removeSample(sample_id);
            const uuid = (new Date()).getTime();
            sseEmitter.emit('message', {
                id: uuid,
                type: 'sample',
                sampleId: sample_id,
                data: deletedSample, 
                action: 'remove',
                message: "Sample Removed"
            });
            res.json(deletedSample);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default SamplesController;
