import { Activity, Beneficiary, City, Clasification, FileNumber, FolderLocation, GroupedState, Municipality, Observation, Prisma, Property, Province, Reference, State, Tracking, Type, Unit, User } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

type TrackingInput = {
  state: State
  responsible: User
} & Tracking

type PropertyInput = Property & {
  activity: Pick<Activity, 'name'>,
  clasification: Pick<Clasification, 'name'>
  state: Pick<State, 'name'>
  groupedState: Pick<GroupedState, 'name'>
  city: Pick<City, 'name'>
  province: Pick<Province, 'name'>
  municipality: Pick<Municipality, 'name'>
  folderLocation: Pick<FolderLocation, 'name'>
  technical?: { user: Pick<User, 'username'> }
  legal?: { user: Pick<User, 'username'> }
  type: Pick<Type, 'name'>
  responsibleUnit: Pick<Unit, 'name'>
  reference: Pick<Reference, 'name'>
  fileNumber: Pick<FileNumber, 'number' | 'id'>
  technicalObservation: string
  trackings: TrackingInput[],
  beneficiaries: Pick<Beneficiary, 'name'>[]
  observations: Pick<Observation, 'observation'>[]
}

export const createProperty = async (
  _parent: any,
  {
    input:
    {
      name,
      area,
      expertiseOfArea,
      plots,
      bodies,
      sheets,
      code,
      codeOfSearch,
      agrupationIdentifier,
      secondState,
      polygone,
      technicalObservation,
      fileNumber,
      activity,
      clasification,
      state,
      groupedState,
      city,
      province,
      municipality,
      folderLocation,
      technical,
      legal,
      type,
      responsibleUnit,
      reference,
      trackings,
      beneficiaries,
      observations
    }
  }: { input: PropertyInput }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'PROPERTY');

    const property = await prisma.property.create({
      data: {
        name,
        area,
        expertiseOfArea,
        plots,
        bodies,
        sheets,
        code,
        codeOfSearch,
        agrupationIdentifier,
        secondState,
        polygone,
        technicalObservation,
        fileNumber: {
          create: fileNumber
        },
        observations: {
          createMany: {
            data: observations
          }
        },
        activity: {
          connect: activity
        },
        clasification: {
          connect: clasification
        },
        state: {
          connect: state
        },
        groupedState: {
          connect: groupedState
        },
        city: {
          connect: city
        },
        province: {
          connect: province
        },
        municipality: {
          connect: municipality
        },
        folderLocation: {
          connect: folderLocation
        },
        type: {
          connect: type
        },
        responsibleUnit: {
          connect: responsibleUnit
        },
        reference: {
          connect: reference
        },
        technical: technical && technical.user ? {
          create: {
            user: {
              connect: technical.user
            }
          }
        } : undefined,
        legal: legal && legal.user ? {
          create: {
            user: {
              connect: legal.user
            }
          }
        } : undefined
      }
    })

    for (let beneficiary of beneficiaries) {
      await prisma.beneficiary.upsert({
        where: {
          name: beneficiary.name
        },
        create: {

          name: beneficiary.name,
          properties: {
            connect: {
              id: property.id
            }
          }
        },
        update: {}
      })
    }

    for (let tracking of trackings) {
      await prisma.tracking.create({
        data: {
          observation: tracking.observation,
          dateOfInit: tracking.dateOfInit,
          numberOfNote: tracking.numberOfNote,
          state: {
            connect: {
              name: tracking.state.name
            }
          },
          responsible: tracking.responsible?.username ? {
            connect: {
              username: tracking.responsible.username
            }
          } : undefined,
          property: {
            connect: {
              id: property.id
            }
          }
        }
      })
    }

    return property;
  } catch (e) {
    throw e;
  }
};

export const updateProperty = async (_parent: any, { input: { id, name, area, expertiseOfArea, plots, bodies, sheets, code, codeOfSearch, agrupationIdentifier, secondState, polygone, fileNumber, technicalObservation, activity, clasification, state, groupedState, city, province, municipality, folderLocation, technical, legal, type, responsibleUnit, reference } }: { input: PropertyInput }, { prisma, userContext }: Context) => {

  hasPermission(userContext, 'UPDATE', 'PROPERTY');
  console.log({ fileNumber })
  const propertyUpdated = await prisma.property.update({
    where: {
      id
    },
    data: {
      name,
      area,
      expertiseOfArea,
      plots,
      bodies,
      sheets,
      code,
      codeOfSearch,
      agrupationIdentifier,
      secondState,
      polygone,
      technicalObservation,
      fileNumber: fileNumber && fileNumber.number ? {
        upsert: {
          where: {
            propertyId: id,
          },
          create: {
            number: fileNumber.number
          },
          update: {
            number: fileNumber.number
          }
        },
      } : fileNumber.number?.length === 0 ? {
        delete: {
          propertyId: id
        }
      } : undefined,
      activity: activity?.name ? {
        connect: activity
      } : undefined,
      clasification: clasification?.name ? {
        connect: clasification
      } : undefined,
      state: {
        connect: state
      },
      groupedState: {
        connect: groupedState
      },
      city: {
        connect: city
      },
      province: {
        connect: province
      },
      municipality: {
        connect: municipality
      },
      folderLocation: {
        connect: folderLocation
      },
      type: {
        connect: type
      },
      responsibleUnit: {
        connect: responsibleUnit
      },
      reference: {
        connect: reference
      },
      technical: technical && technical.user ? {
        update: {
          user: {
            connect: technical.user
          }
        }
      } : undefined,
      legal: legal && legal.user ? {
        update: {
          user: {
            connect: legal.user
          }
        }
      } : undefined,
    },
    include: {
      beneficiaries: {
        select: { name: true }
      },
    }
  })

  return propertyUpdated;
}