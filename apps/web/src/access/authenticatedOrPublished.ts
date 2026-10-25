import type { Access, Where } from "payload";

export const authenticatedOrPublished: Access = ({ req }) => {
  if (req?.user) return true;

  return {
    _status: {
      equals: "published",
    },
  } satisfies Where;
};

export const authenticatedOrApprovedProject: Access = ({ req }) => {
  if (req?.user) return true;

  return {
    status: {
      equals: "published",
    },
  } satisfies Where;
};

export const authenticatedOrPublishedStatus: Access = authenticatedOrApprovedProject;
