import { FolderLocation } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createFolderLocation = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "FOLDERLOCATION");

    return prisma.folderLocation.create({
      data: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const updateFolderLocation = (
  _parent: any,
  { currentName, name }: { currentName: string; name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "FOLDERLOCATION");

    return prisma.folderLocation.update({
      where: {
        name: currentName,
      },
      data: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const deleteFolderLocation = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "FOLDERLOCATION");

    return prisma.folderLocation.delete({
      where: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
