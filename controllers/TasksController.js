import TasksModel from '../models/TasksModel.js';
import { sseEmitter } from '../middlewares/sseEmitterMiddlewares.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

import exportedFunctions from '../middlewares/authMiddlewares.js';

const {whoAmI } = exportedFunctions;

const USER_ROLES = {
    // 'Stylist', 'Manager', 'Modelist', 'ExecutiveWorker', 'Tester', 'ProductionResponsible'
  MANAGER: 'Manager',
  MODELIST: 'Modelist',
  STYLIST: 'Stylist',
  EXECUTIVE_WORKER: 'ExecutiveWorker',
  TESTER: 'Tester',
  PRODUCTION_RESPONSIBLE: 'ProductionResponsible'
};
const SAMPLE_STATUS = {
  // 'new',                  // responsable: stylist
  // 'edit',                 // responsable: stylist
  // 'in_review',            // responsable: Manager
  // 'in_development',       // responsable: Modelist
  // 'development_done',     // responsable: Stylist
  // 'external_task',        // responsable: Stylist
  // 'external_task_done',   // responsable: Stylist
  // 'in_production',        // responsable: ExecutiveWorker
  // 'testing',              // responsable: Tester
  // 'accepted',             // responsable: Modelist
  // 'rejected',             // responsable: isActive = false
  // 'readjustment',         // responsable: Modelist
  // 'cut_phase',            // responsable: Modelist
  // 'preparing_traces',     // responsable: Modelist
  // 'ready'                 // responsable: isActive = false  
  NEW: 'new',
  EDIT: 'edit',
  IN_REVIEW: 'in_review',
  IN_DEVELOPMENT: 'in_development',
  DEVELOPMENT_DONE: 'development_done',
  EXTERNAL_TASK: 'external_task',
  EXTERNAL_TASK_DONE: "external_task_done",
  IN_PRODUCTION: 'in_production',
  TESTING: 'testing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  READJUSTMENT: 'readjustment',
  CUT_PHASE: 'cut_phase',
  PREPARING_TRACES: 'preparing_traces',
  GETTING_PROD_INFO: 'getting_prod_info',
  READY: 'ready'
}

class TasksController {

    // Get Samlpe's Taskes
    static async getAllAvailableTasks(req, res) {
        try {
            const myRole = await whoAmI(req, res);
            const timelines = await TasksModel.fetchAllTimelines();
            let response = null;
            // Deduplicate by latest timestamp per sample_id
            response = Object.values(
                timelines.reduce((acc, timeline) => {
                    const existing = acc[timeline.sample_id];
                    if (!existing || new Date(timeline.timestamp) > new Date(existing.timestamp)) {
                        acc[timeline.sample_id] = timeline;
                    }
                    return acc;
                }, {})
            );
            switch(myRole) {
                case USER_ROLES.STYLIST:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.NEW ||
                        timeline.status === SAMPLE_STATUS.EDIT ||
                        timeline.status === SAMPLE_STATUS.DEVELOPMENT_DONE ||
                        timeline.status === SAMPLE_STATUS.EXTERNAL_TASK ||
                        timeline.status === SAMPLE_STATUS.EXTERNAL_TASK_DONE
                    ));
                    break;
                    
                case USER_ROLES.MANAGER:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_REVIEW
                    ));
                    break;
                
                case USER_ROLES.MODELIST:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_DEVELOPMENT ||
                        timeline.status === SAMPLE_STATUS.ACCEPTED ||
                        timeline.status === SAMPLE_STATUS.READJUSTMENT ||
                        timeline.status === SAMPLE_STATUS.CUT_PHASE ||
                        timeline.status === SAMPLE_STATUS.PREPARING_TRACES
                    ));
                    break;
                    
                case USER_ROLES.EXECUTIVE_WORKER:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_PRODUCTION
                    ));
                    break;
                    
                case USER_ROLES.TESTER:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.TESTING
                    ));
                    break;
                    
                case USER_ROLES.PRODUCTION_RESPONSIBLE:
                    response = response.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.GETTING_PROD_INFO
                    ));
                    break;
                    
                default:
                    res.status(400).json({
                        success: false,
                        error: "Invalid role"
                    });
                    break;
            }
            if(response) {
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

export default TasksController;
