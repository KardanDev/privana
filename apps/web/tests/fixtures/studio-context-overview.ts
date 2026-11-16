import { creator, post } from "../posts/social-fixtures";

export const studioContextOverview = {
  metrics: { activeSubscriptions: 0, followers: 2, interests: 3, posts: 2 },
  nextCursor: null,
  posts: [post, { ...post, id: "post-b", title: "Outra publicação" }],
  profile: creator,
};
