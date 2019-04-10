import saveAs from '../../../static/FileSaver'
console.log(saveAs)
window.saveAs = saveAs;
export default saveAs;