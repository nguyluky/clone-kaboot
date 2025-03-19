export const CAU_HOI_ROUTES = Object.freeze({
  BASE: '/',
  BY_ID: '/:cau_hoi_id',
  BY_CANVA_ID: '/:canva_id'
});

export const CANVA_ROUTES = Object.freeze({
  BASE: '/',
  BY_ID: '/:canva_id',
  SESSION: '/:canva_id/session',
  CAU_HOI: '/:canva_id/cauhoi'
});

export const SESSION_ROUTES = Object.freeze({
  BASE: '/',
  BY_ID: '/:session_id',
  BY_CODE_JOIN: '/code/:code_join',
  QUESTION: '/code/:code_join/question',
  SUBMIT_ANSWER: '/code/:code_join/submit',
  PUBLIC: '/public',
  LEADERBOARD: '/:session_id/leaderboard'
});

export const PLAYER_ROUTES = Object.freeze({
  BASE: '/',
  BY_ID: '/:uuid',
});

export default {
  CAU_HOI_ROUTES,
  CANVA_ROUTES,
  SESSION_ROUTES,
  PLAYER_ROUTES
};