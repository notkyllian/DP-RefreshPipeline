import request from 'request';
import Applicatie from '../models/applicatie';
import fetch from 'isomorphic-fetch';

async function getData(appkey) {
  const data = await Applicatie.findOne({
    key: appkey,
  });
  if (data.length === 0) {
    return null;
  }
  return data;
}

async function getVersion(appKey) {
  const data = await getData(appKey);
  if (!data || !data.statusurl) {
    return false;
  }
  const response = await fetch(data.statusurl);
  if (!response.ok) {
    throw new Error(response.status);
  }
  const body = await response.json();
  return body;
}

async function refreshUI(appkey) {
  const url = getData(appkey);
  return url.then((data) => {
    if (!data) {
      return false;
    }
    return new Promise((resolve, reject) => {
      request.get(data.refreshurl, (err, resp, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(body).versie);
      });
    });
  });
}

async function isBusy(appkey) {
  const data = await getData(appkey);
  return data.busy;
}

async function setBusy(appkey, updatedata) {
  const data = await getData(appkey);
  await data.update({ busy: updatedata });
}

function getStatus(req, res) {
  const app = req.params.id;
  if (app !== undefined) {
    getVersion(app).then((data) => {
      const currentversion = data.version;
      let count = 0;
      isBusy(app).then((busy) => {
        if (busy) {
          res.send('busy');
          return;
        }
        setBusy(app, 'true').then(() => {
          const intervalObject = setInterval(() => {
            count++;
            if (count === 60) {
              setBusy(app, 'false');
              console.log('---TimeOut---');
              res.send('timeout');
              clearInterval(intervalObject);
              return false;
            }
            getVersion(app).then((newdata) => {
              const newversion = newdata.version;
              if (currentversion === newversion) {
                return false;
              }
              console.log('Nieuwe versie gedetecteerd');
              refreshUI(app).then((refreshdata) => {
                if (refreshdata) {
                  res.send('Success');
                  console.log('Success');
                  setBusy(app, 'false');
                  clearInterval(intervalObject);
                  return true;
                }
                return false;
              });
              return false;
            });
          }, 5000);
        });
      });

    });
  } else {
    res.status(404);
    res.send('invalid key');
  }
}


function getAllData(req, res) {
  Applicatie.find({}, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    if (data.length === 0) {
      console.log('No record found');
      return;
    }
    res.send(data);
  });
}
export {
  getStatus,
  getAllData,
};
