const fs = require('fs');
const pdf = require('pdf-parse');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let file = "citation.pdf"


const CheckFile = (file) =>
{

    const buffer = readChunk.sync(file, 0, fileType.minimumBytes);
    let type = fileType(buffer);
    if(type.ext == 'pdf') CheckCitations(file);
    else console.error("FATAL ERROR :  Invalid File Type");
}


let CheckCitations = (file) => {

    Checkfile(file);
    let dataBuffer = fs.readFileSync(file);
 
    pdf(dataBuffer).then(function(data) {
    
        let s = data.text;
        const re = /\(([A-Z][a-z]+)(.*,\s+)(\d\d\d\d)\)/g; // Regex for Format (Abs fd, 1111)

        let found = s.match(re);  // Filter The Strings

        let Santize = found.map(function(x){return x.replace(/\r?\n|\r/g, '');}); // Remove Line Breaks in Reusults
        let Santize2 = Santize.map(function(x){return x.replace(/\s{3,}/g, '  ');}); // Remove Extra Spaces

        var counts = {};

        Santize2.forEach(function(element) {
            counts[element] = (counts[element] || 0) + 1;
        }); // Count and remove Duplicates

       Sheet (counts);

    
    
    });

}
let Sheet = (counts)=>
{
   
    const csvWriter = createCsvWriter({
        path: 'Citations.csv',
        header: [
            {id: 'citation', title: 'Citation'},
            {id: 'counts', title: 'Counts'}
        ]
    });
     
    const records = [];
    for(let e in counts)
    {
         records.push({"citation" : e , "counts" : counts[e]});
         console.log(e + "  "+ counts[e]);
    }
     
    csvWriter.writeRecords(records)       
        .then(() => {
            console.log('...Done');
        });
     

}
CheckCitations(file);
