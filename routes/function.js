const CloudmersiveVirusApiClient = require('cloudmersive-virus-api-client');
const NodeClam = require('clamscan');
const ClamScan = new NodeClam().init({
    clamdscan: {
        socket: '/let/run/clamd.scan/clamd.sock', // This is pretty typical
        host: '127.0.0.1', // If you want to connect locally but not through socket
        port: 12345, // Because, why not
        timeout: 300000, // 5 minutes
        localFallback: true, // Use local preferred binary to scan if socket/tcp fails
        path: '/bin/clamdscan', // Special path to the clamdscan binary on your server
        configFile: '/etc/clamd.d/daemon.conf', // A fairly typical config location
        multiscan: false, // You hate speed and multi-threaded awesome-sauce
        reloadDb: true, // You want your scans to run slow like with clamscan
        active: false, // you don't want to use this at all because it's evil
        bypassTest: true, // Don't check to see if socket is available. You should probably never set this to true.
    },
    preference: 'clamscan' // If clamscan is found and active, it will be used by default
});
const fs = require("fs");
const path = require("path");
const contacStorage = require("../storage/mongo/contacList");

exports.img = async function img() {
    const contacs = await contacStorage.getAll();
    let userPhoto = [];
    let userImage = [];
    let storage = {};
    let _storage = {};

    let filePhoto = fs.readdirSync(path.join(__dirname, "../", "uploads"));
    contacs.forEach((element) => {
        element.photo.forEach((el) => {
            userPhoto.push(el.trim().split("/api/file/").pop());
        });
        element.image.forEach((el) => {
            userImage.push(el.trim().split("/api/file/").pop());
        });
    });

    for (let key of userPhoto) {
        storage[key] = 1
    }
    for (let key of userImage) {
        _storage[key] = 1
    }

    for (let i = 0; i < filePhoto.length; i++) {
        if (!storage[filePhoto[i]] && !_storage[filePhoto[i]]) {
            fs.unlink(path.join(__dirname, "../", "uploads", filePhoto[i]), (err) => {
                if (err) return err;
            });
        }
    }
};

exports.imgDelete = async function imgDelete(id) {
    const contac = await contacStorage.get(id);
    let userPhoto
    let userImage

    if (contac.photo.length > 0) {
        contac.photo.forEach((element) => {
            userPhoto = element.trim().split('/api/file/').pop()

            fs.unlink(path.join(__dirname, '../', 'uploads', userPhoto), (err) => {
                if (err) return err
            })
        })
    }
    if (contac.image.length > 0) {
        contac.image.forEach((element) => {
            userImage = element.trim().split('/api/file/').pop()

            fs.unlink(path.join(__dirname, '../', 'uploads', userImage), (err) => {
                if (err) return err
            })
        })
    }
}




exports.main = async function main() {
    // Get instance by resolving ClamScan promise object
    ClamScan.then(clamscan => {
        const scan_status = { good: 0, bad: 0 };
        let files = fs.readdirSync(path.join(__dirname, "../", "routes"));
        clamscan.scanFiles(files, (err, goodFiles, badFiles, viruses) => {
            if (err) return console.error(err);
            if (badFiles.length > 0) {
                console.log({
                    msg: `${goodFiles.length} files were OK. ${badFiles.length} were infected!`,
                    badFiles,
                    goodFiles,
                    viruses,
                });
            } else {
                console.log({ msg: "Everything looks good! No problems here!." });
            }
        }, (err, file, isInfected, viruses) => {
            ; (isInfected ? scan_status.bad++ : scan_status.good++);
            console.log(`${file} is ${(isInfected ? `infected with ${viruses}` : 'ok')}.`);
            console.log('Scan Status: ', `${(scan_status.bad + scan_status.good)}/${files.length}`);
        });
    }).catch(err => {
        console.log(err, 'sasd');
    });
    scan()
}


function scan() {
    let defaultClient = CloudmersiveVirusApiClient.ApiClient.instance;

    //joining path of directory 
    const directoryPath = "./uploads"; // path.join(__dirname, 'Documents');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            let fullPath = path.join("./uploads", file);

            // Do whatever you want to do with the file
            // Configure API key authorization: Apikey
            let Apikey = defaultClient.authentications['Apikey'];
            Apikey.apiKey = "402380c4-b4f1-47bc-b5aa-cb76c73c1ed8"

            let api = new CloudmersiveVirusApiClient.ScanApi()

            let inputFile = fs.readFileSync(fullPath);


            let callback = function (error, data, response) {
                if (error) {
                    console.error(error);
                } else {
                    if (data.CleanResult) {
                        console.log('Clean file: ' + fullPath);
                    }
                    else {
                        console.log('!!!!!! VIRUS FOUND !!!!!! ' + fullPath);
                    }
                }
            };

            api.scanFile(Buffer.from(inputFile.buffer), callback);
        });
    });
}