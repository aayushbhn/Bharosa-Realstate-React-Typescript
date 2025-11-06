import { Router } from 'express';
import auth from './modules/auth';
import properties from './modules/properties';
import leads from './modules/leads';
import visits from './modules/visits';
import deals from './modules/deals';
import recs from './modules/recs';
import agents from './modules/agents';    // <-- add
import saved from './modules/saved';
import interactions from './modules/interactions';
import admin from './modules/admin';

export const router = Router();
router.use('/auth', auth);
router.use('/properties', properties);
router.use('/leads', leads);
router.use('/visits', visits);
router.use('/deals', deals);
router.use('/recs', recs);
router.use('/agents', agents);            // <-- add

/* ...existing... */
router.use('/saved', saved);
router.use('/interactions', interactions);
router.use('/admin', admin);

