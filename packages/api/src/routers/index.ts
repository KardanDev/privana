import type { RouterClient } from "@orpc/server";
import { analyticsOverview } from "../domains/admin/analytics/overview";
import { getCms } from "../domains/admin/cms/get";
import { cmsHistory } from "../domains/admin/cms/history";
import { publishCms } from "../domains/admin/cms/publish";
import { restoreCmsDraft } from "../domains/admin/cms/restore-draft";
import { saveCmsDraft } from "../domains/admin/cms/save-draft";
import { operationsAudits } from "../domains/admin/operations/audits";
import { operationsCreators } from "../domains/admin/operations/creators";
import { operationsReports } from "../domains/admin/operations/reports";
import { operationsSubscriptions } from "../domains/admin/operations/subscriptions";
import { operationsTransactions } from "../domains/admin/operations/transactions";
import { operationsUsers } from "../domains/admin/operations/users";
import { adminOverview } from "../domains/admin/overview";
import { reportDetails } from "../domains/admin/report-details";
import { resolveReport } from "../domains/admin/resolve-report";
import { revokeSubscription } from "../domains/admin/revoke-subscription";
import { setCreatorStatus } from "../domains/admin/set-creator-status";
import { setTeamRole } from "../domains/admin/set-team-role";
import { setUserStatus } from "../domains/admin/set-user-status";
import { getCreator } from "../domains/creators/get";
import { listCreators } from "../domains/creators/list";
import { setFollow } from "../domains/creators/set-follow";
import { listFeed } from "../domains/feed/list";
import { listMemberships } from "../domains/memberships/list";
import { requestMembership } from "../domains/memberships/request";
import { getMessages } from "../domains/messages/get";
import { listConversations } from "../domains/messages/list";
import { sendMessage } from "../domains/messages/send";
import { startConversation } from "../domains/messages/start";
import { listNotifications } from "../domains/notifications/list";
import { markRead } from "../domains/notifications/mark-read";
import { getPlatform } from "../domains/platform/get";
import { addComment } from "../domains/posts/add-comment";
import { listComments } from "../domains/posts/comments";
import { setBookmark } from "../domains/posts/set-bookmark";
import { setLike } from "../domains/posts/set-like";
import { createReport } from "../domains/reports/create";
import { getSettings } from "../domains/settings/get";
import { updateSettings } from "../domains/settings/update";
import { deletePost } from "../domains/studio/delete-post";
import { studioOverview } from "../domains/studio/overview";
import { savePost } from "../domains/studio/save-post";
import { saveProfile } from "../domains/studio/save-profile";
import { getViewer } from "../domains/viewer/get";
export const appRouter = {
  admin: {
    analytics: { overview: analyticsOverview },
    cms: {
      get: getCms,
      history: cmsHistory,
      publish: publishCms,
      restoreDraft: restoreCmsDraft,
      saveDraft: saveCmsDraft,
    },
    operations: {
      audits: operationsAudits,
      creators: operationsCreators,
      reports: operationsReports,
      subscriptions: operationsSubscriptions,
      transactions: operationsTransactions,
      users: operationsUsers,
    },
    overview: adminOverview,
    reportDetails,
    resolveReport,
    revokeSubscription,
    setCreatorStatus,
    setTeamRole,
    setUserStatus,
  },
  creators: { get: getCreator, list: listCreators, setFollow },
  feed: { list: listFeed },
  memberships: { list: listMemberships, request: requestMembership },
  messages: {
    get: getMessages,
    list: listConversations,
    send: sendMessage,
    start: startConversation,
  },
  notifications: { list: listNotifications, markRead },
  platform: { get: getPlatform },
  posts: { addComment, comments: listComments, setBookmark, setLike },
  reports: { create: createReport },
  settings: { get: getSettings, update: updateSettings },
  studio: { deletePost, overview: studioOverview, savePost, saveProfile },
  viewer: { get: getViewer },
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
