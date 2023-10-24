import { Prisma, Property, Tracking } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

type TrackingInput = {
  stateName: string
  responsibleUsername: string
} & Pick<Tracking, 'numberOfNote' | 'observation' | 'dateOfInit' | 'dateOfEnd'>

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
      activityName,
      clasificationName,
      stateName,
      groupedStateName,
      cityName,
      provinceName,
      municipalityName,
      subDirectoryName,
      technicalUsername,
      legalUsername,
      typeName,
      responsibleUnitName,
      referenceName,
      trackings
    }
  }: {
    input: Property &
    {
      activityName: string
      clasificationName: string
      stateName: string
      groupedStateName: string
      cityName: string
      provinceName: string
      municipalityName: string
      subDirectoryName: string
      technicalUsername: string
      legalUsername: string
      typeName: string
      responsibleUnitName: string
      referenceName: string
      trackings: TrackingInput[]
    }
  }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'PROPERTY');
    const stateNames = trackings.map(tracking => tracking.stateName)
    const userNames = trackings.map(tracking => tracking.responsibleUsername);
    const stateIds: Record<string, string> = {}
    const usernames: Record<string, string> = {}

    for (let name of stateNames) {
      const state = await prisma.state.findUniqueOrThrow({
        where: {
          name
        }
      })
      stateIds[state.name] = state.id;
    }

    for (let username of userNames) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          username
        }
      })
      usernames[user.username] = user.id
    }
    console.log({ trackings })
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
        activity: {
          connect: {
            name: activityName
          }
        },
        clasification: {
          connect: {
            name: clasificationName
          }
        },
        state: {
          connect: {
            name: stateName
          }
        },
        groupedState: {
          connect: {
            name: groupedStateName
          }
        },
        city: {
          connect: {
            name: cityName
          }
        },
        province: {
          connect: {
            name: provinceName
          }
        },
        municipality: {
          connect: {
            name: municipalityName
          }
        },
        subDirectory: {
          connect: {
            name: subDirectoryName
          }
        },
        type: {
          connect: {
            name: typeName
          }
        },
        responsibleUnit: {
          connect: {
            name: responsibleUnitName
          }
        },
        reference: {
          connect: {
            name: referenceName
          }
        },
        technical: {
          create: {
            user: {
              connect: {
                username: technicalUsername
              }
            }
          }
        },
        legal: {
          create: {
            user: {
              connect: {
                username: legalUsername
              }
            }
          }
        }
      }
    })
    const mapTrackings = trackings.map(({ stateName, responsibleUsername, observation, numberOfNote, dateOfEnd, dateOfInit }) => ({
      state_id: stateIds[stateName],
      user_id: usernames[responsibleUsername],
      observation,
      numberOfNote,
      dateOfInit: new Date(dateOfInit).toISOString(),
      dateOfEnd: dateOfEnd ? new Date(dateOfEnd).toISOString() : null,
      property_id: property.id
    }))
    await prisma.tracking.createMany({
      data: mapTrackings
    })

    return property;
  } catch (e) {
    throw e;
  }
};