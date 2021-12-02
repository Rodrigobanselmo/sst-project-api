import ExcelJS from 'excelJS';

const User = [
  {
    fname: 'Amir',
    lname: 'Mustafa',
    email: 'amir@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Ashwani',
    lname: 'Kumar',
    email: 'ashwani@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Nupur',
    lname: 'Shah',
    email: 'nupur@gmail.com',
    gender: 'Female',
  },
  {
    fname: 'Himanshu',
    lname: 'Mewari',
    email: 'himanshu@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Vankayala',
    lname: 'Sirisha',
    email: 'sirisha@gmail.com',
    gender: 'Female',
  },
];

class ExcelProvider {
  async create() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'S no.', key: 's_no', width: 10 },
      { header: 'First Name', key: 'fname', width: 10 },
      { header: 'Last Name', key: 'lname', width: 10 },
      { header: 'Email Id', key: 'email', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
    ];
    // Looping through User data
    User.forEach((user, index) => {
      worksheet.addRow({ s_no: index + 1, ...user }); // Add data in worksheet
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer({ filename: 'test.xlsx' });
    console.log(`buffer`, buffer);
    return;
  }
}

export { ExcelProvider };
