// const dir = readdirSync('tmp/upload')


//     await asyncBatch(dir, 10, async (fileName: any) => {
//       if (fileName.includes('PGR')) {

//         const file = readFileSync(`tmp/upload/${fileName}`)
//         //convert to any

//         const sss = {
//           buffer: file,
//           originalname: fileName
//         } as any

//         console.log('adding image ' + fileName)
//         await this.createImageGalleyService.execute({ companyId: user.targetCompanyId, name: fileName, types: ['PGR'] }, user, sss);
//         console.log('added image ' + fileName)
//       }
//     });