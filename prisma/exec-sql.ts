import { HierarchyBrowseShortQuerie } from './../src/@v2/security/action-plan/database/dao/hierarchy/queries/browse-short-hierarchy.dao';
// import { CharacterizationDAO } from '../src/@v2/security/database/dao/characterization/characterization.dao';
// import { ActionPlanDAO } from '../src/@v2/security/database/dao/action-plan/action-plan.dao';
// import { ActionPlanOrderByEnum } from '../src/@v2/security/database/dao/action-plan/action-plan.types';
import { OrderByDirectionEnum } from '../src/@v2/shared/types/order-by.types';
import { PrismaClient } from '@prisma/client';
import { CommentDAO } from '../src/@v2/security/action-plan/database/dao/comment/comment.dao';
import { CommentOrderByEnum } from '../src/@v2/security/action-plan/database/dao/comment/comment.types';
import { CommentTextTypeEnum } from '../src/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '../src/@v2/security/action-plan/domain/enums/comment-type.enum';

const prisma = new PrismaClient({});


{
    const data = await new HierarchyBrowseShortQuerie(prisma).browseShort({
        limit: 100,
        filters: {
            search: 'Jr II',
            companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
            // search: 'Tostadeira Vertical e Condimentação',
            workspaceIds: ['f588207b-ac7b-4b63-9d85-cd5753f9b288'],
            // type: [],
        },
    })

    console.log(data)
}

//action plan
// {
//     // // await prisma.riskFactorDataRec.create({
//     // //     data: {
//     // //         riskFactorDataId: "17d3dd38-b910-49ad-a149-63be94f969f9",
//     // //         companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
//     // //         recMedId: "52e056d1-40ab-4749-9a8f-07ceac162d31",
//     // //         workspaceId: "f588207b-ac7b-4b63-9d85-cd5753f9b288",
//     // //         endDate: new Date(),
//     // //     }
//     // // })

//     const data = await new ActionPlanDAO(prisma).browse({
//         filters: {
//             companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
//             // search: 'Tostadeira Vertical e Condimentação',
//             // workspaceIds: ['f588207b-ac7b-4b63-9d85-cd5753f9b288'],
//             // hierarchyIds: ['75a1f3da-ebc5-44a6-bfe2-96804e384879', '273f690e-5f6d-4084-ae4f-846e198aae63'],
//             // generateSourceIds: ['0a947571-cd85-4da5-bd29-47064a902034'],
//             // isExpired: true,
//             // isCanceled: false,
//             // isDone: false,
//             // isStarted: false,
//             // ocupationalRisks: [4, 5],
//             // recommendationIds: ["52e056d1-40ab-4749-9a8f-07ceac162d31"],
//             // riskIds: ["7406d7ed-d93a-466d-81ae-c4f052f6d525"],
//             // status: ['PENDING'],
//             // responisbleIds: [1],
//         },
//         orderBy: [{
//             field: ActionPlanOrderByEnum.ORIGIN,
//             order: OrderByDirectionEnum.ASC
//         }]
//     })

//     // console.log(data[0])
//     // console.log(data.map(d => d.uuid.recommendationId))
//     console.log(JSON.stringify(data.results[0], null, 2))
//     console.log(JSON.stringify(data.pagination, null, 2))
//     console.log(JSON.stringify(data.filters, null, 2))
//     console.timeEnd('prisma')

//     // const data = await new CharacterizationDAO(prisma).browse({
//     //     filters: {
//     //         companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
//     //         workspaceId: 'f588207b-ac7b-4b63-9d85-cd5753f9b288',
//     //         search: 'Tostadeira Vertical e Condimentação',
//     //         // search: 'Tostadeira Vertical e Condimentação',
//     //         // workspaceIds: ['f588207b-ac7b-4b63-9d85-cd5753f9b288'],
//     //         // hierarchyIds: ['75a1f3da-ebc5-44a6-bfe2-96804e384879', '273f690e-5f6d-4084-ae4f-846e198aae63'],
//     //         // generateSourceIds: ['0a947571-cd85-4da5-bd29-47064a902034'],
//     //         // isExpired: true,
//     //         // isCanceled: false,
//     //         // isDone: false,
//     //         // isStarted: false,
//     //         // ocupationalRisks: [4, 5],
//     //         // recommendationIds: ["52e056d1-40ab-4749-9a8f-07ceac162d31"],
//     //         // riskIds: ["7406d7ed-d93a-466d-81ae-c4f052f6d525"],
//     //     }
//     // })

//     // // console.log(data[0])
//     // console.log(data.pagination)
// }