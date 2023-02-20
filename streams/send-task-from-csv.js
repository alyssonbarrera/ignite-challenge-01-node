import fs from 'node:fs';
import { parse } from 'csv-parse';

function sendTasksFromCsv() {
    const readStream = fs.createReadStream('src/streams/tasks.csv');
    const parser = parse({
      columns: true
    });
  
    parser.on('readable', () => {
      let record;
      while (record = parser.read()) {
        const task = {
          title: record.title,
          description: record.description
        };
  
        fetch('http://localhost:3030/tasks', {
          method: 'POST',
          body: JSON.stringify(task),
        }).then(res => {
          return res.json();
        }).catch(error => {
          return res.end(JSON.stringify(error));
        })
      }
    });

    readStream.pipe(parser);
}

sendTasksFromCsv();