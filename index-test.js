'use strict'
console.log(new Date())
const printBox = document.getElementById('printBox')
const printBtn = document.getElementById('printBtn')

const logTestBtn = () => {
    console.log('test click')
    const printWindow = window.open('', '', 'height=400,width=800')
    // printWindow.document.write('<html><head><title>DIV Contents</title>');
    // printWindow.document.write('</head><body >');
    printWindow.document.write(printBox.innerHTML);
    // printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}


printBtn.addEventListener('click', logTestBtn)


console.log(printBox)