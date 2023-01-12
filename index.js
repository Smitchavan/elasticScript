var elasticsearch = require("elasticsearch");
var mysql = require("mysql2");
const express = require("express");
const app = express();
const util = require("util");

app.use(express.json());
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://localhost", host, port);
});
// //elastic queries
var client = new elasticsearch.Client({
  // do not forget to add the username and password in the url
  host: "http://localhost:9200/",
});
//data I am trying to add
client.cluster.health({}, function (err, resp, status) {
  console.log("-- Client Health --", resp);
});
//sql connection
var con = mysql.createConnection({
  host: "localhost",
  user: "smit",
  password: "Smit@2341",
  database: "task",
});

const stream = con.query("SELECT * FROM disposecall").stream();

stream.on("data", (row) => {
  // Process the row
  let cdrid = row.cdrid;
  let tt = row.agent_talktime_sec;
  client
    .updateByQuery({
      index: "database",
      type: "dummy",
      body: {
        query: {
          match_phrase: {
            "callInfo.agentLegUuid": cdrid,
          },
        },
        script: { source: `ctx._source.callInfo.callTime.talkTime = ${tt}` },
      },
    })
    .then(
      function (resp) {
        console.log(resp.hits);
      },
      function (err) {
        console.trace(err.message);
      }
    );

  console.log();
});

// stream.on("end", () => {
//   // All rows have been received
//   con.end();
// });

// const query = util.promisify(con.query).bind(con);
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// app.get("/", async (req, res) => {
//   try {
//     let sql = `SELECT * from disposecall where id=${req.body.id}`;
//     const result = await query(sql);
//     // console.log(result);
//     res.send(result);
//     stElastic(result);
//   } catch (error) {}
// });

// const stElastic = (result) => {
//   console.log(result);
//   let tt = result[0].agent_talktime_sec;
//   let crid = result[0].cdrid;
//   console.log(tt);
//   console.log(crid);
//   /* Query Documents and Print to Console */
//   client
//     .updateByQuery({
//       index: "database",
//       type: "dummy",
//       body: {
//         query: {
//           match_phrase: {
//             "callInfo.agentLegUuid": crid,
//           },
//         },
//         script: { source: `ctx._source.callInfo.callTime.talkTime = ${tt}` },
//       },
//     })
//     .then(
//       function (resp) {
//         console.log(resp.hits.hits[0]._source.callInfo.callTime);
//       },
//       function (err) {
//         console.trace(err.message);
//       }
//     );

//   client
//     .search({
//       index: "database",
//       type: "dummy",
//       body: {
//         query: {
//           match_phrase: {
//             "callInfo.agentLegUuid": crid,
//           },
//         },
//       },
//     })
//     .then(
//       function (resp) {
//         console.log(
//           //   "Successful query! Here is the response:"

//           resp.hits.hits[0]._source.callInfo.callTime
//         );
//       },
//       function (err) {
//         console.trace(err.message);
//       }
//     );
// };
//--------------------------------------------------------------------------------------------------------------------------------
// //elastic queries
// var client = new elasticsearch.Client({
//   // do not forget to add the username and password in the url
//   host: "http://localhost:9200/",
// });
// //data I am trying to add
// client.cluster.health({}, function (err, resp, status) {
//   console.log("-- Client Health --", resp);
// });
// client.search(
//   {
//     index: "database",
//   },
//   function (error, response, status) {
//     if (error) {
//       console.log("search error: " + error);
//     } else {
//       console.log("--- Response ---");
//       console.log(response);
//       console.log("--- Hits ---");
//       response.hits.hits.forEach(function (hit) {
//         console.log(hit);
//       });
//     }
//   }
// );

//-----------------------------------------------------------------------------------------------------------------------------

// client.indices.create(
//   {
//     index: "database",
//   },
//   function (err, resp, status) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("create", resp);
//     }
//   }
// );
// client.index(
//   {
//     index: "database",
//     id: "1",
//     type: "dummy",
//     body: {
//       callInfo: {
//         agentLegUuid: "26fe698a-c50d-4543-ae27-a20c45a46919",
//         callTime: {
//           talkTime: 0,
//         },
//       },
//     },
//   },
//   function (err, resp, status) {
//     console.log(resp);
//   }
// );

// client.indices.delete(
//   { index: "tutorial", id: "1", type: "helloworld" },
//   function (err, resp, status) {
//     console.log("delete", resp);
//   }
// );

// let data = {

// }

// //this is what I am trying to do
//  client.index({
//         index: 'engines',
//         body: data
//     }).then(resp => {
//         return res.status(200).json({
//             message: "Added Data"
//         })
//     }).catch(e => {
//         console.log(e)
//         return res.status(500).json({
//             message: "Error",
//             e
//         })
//     })

// const data = [
//   {
//     callInfo: {
//       agentLegUuid: "1b66674a-471b-4ff4-b9b4-e3dd543b238b",
//       callTime: {
//         talkTime: 0,
//       },
//     },
//   },
//   {
//     callInfo: {
//       agentLegUuid: "1b66674a-471b-4ff4-b9b6-e3dd5ad0233b",
//       callTime: {
//         talkTime: 0,
//       },
//     },
//   },
//   {
//     callInfo: {
//       agentLegUuid: "1b66674a-471b-4ff4-b9b4-e3dd5ad0238b",
//       callTime: {
//         talkTime: 0,
//       },
//     },
//   },
//   {
//     callInfo: {
//       agentLegUuid: "1b66674a-471b-4ff4-b9b4-e3dd5ad0238b",
//       callTime: {
//         talkTime: 0,
//       },
//     },
//   },
// ];
