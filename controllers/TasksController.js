import TasksModel from '../models/TasksModel.js';
import { sseEmitter } from '../middlewares/sseEmitterMiddlewares.js';
// const { hashPassword, comparePassword } = FUNCTIONS;

import exportedFunctions from '../middlewares/authMiddlewares.js';

const {whoAmI } = exportedFunctions;

const USER_ROLES = {
    // 'Stylist', 'Manager', 'Modelist', 'ExecutiveWorker', 'Tester'
  MANAGER: 'Manager',
  MODELIST: 'Modelist',
  STYLIST: 'Stylist',
  EXECUTIVE_WORKER: 'ExecutiveWorker',
  TESTER: 'Tester'
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
  READY: 'ready'
}

class TasksController {

    // Get Samlpe's Taskes
    static async getAllAvailableTasks(req, res) {
        try {
            const myRole = await whoAmI(req, res);
            const timelines = await TasksModel.fetchAllTimelines();
            let response = null;
            switch(myRole) {
                case USER_ROLES.STYLIST:
                    response = timelines.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.NEW ||
                        timeline.status === SAMPLE_STATUS.EDIT ||
                        timeline.status === SAMPLE_STATUS.DEVELOPMENT_DONE ||
                        timeline.status === SAMPLE_STATUS.EXTERNAL_TASK ||
                        timeline.status === SAMPLE_STATUS.EXTERNAL_TASK_DONE
                    ));
                    break;
                    
                case USER_ROLES.MANAGER:
                    response = timelines.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_REVIEW
                    ));
                    break;
                
                case USER_ROLES.MODELIST:
                    response = timelines.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_DEVELOPMENT ||
                        timeline.status === SAMPLE_STATUS.ACCEPTED ||
                        timeline.status === SAMPLE_STATUS.READJUSTMENT ||
                        timeline.status === SAMPLE_STATUS.CUT_PHASE ||
                        timeline.status === SAMPLE_STATUS.PREPARING_TRACES
                    ));
                    break;
                    
                case USER_ROLES.EXECUTIVE_WORKER:
                    response = timelines.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.IN_PRODUCTION
                    ));
                    break;
                    
                case USER_ROLES.TESTER:
                    response = timelines.filter(timeline => (
                        timeline.status === SAMPLE_STATUS.TESTING
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
