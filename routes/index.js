var express = require('express');
const shortid = require('shortid');
const router = express.Router();
const validUrl = require('valid-url');
const fs = require('fs');

router.get('/', function(req,res,next){
    try {

    } catch(err) {
        return res.json({status: false, message: err})
    }
    const resultData = fs.readFileSync('urls.json');
    const getUrlData = resultData.length === 0 || JSON.parse(resultData) === {} ? [] : JSON.parse(resultData);
    return res.json({
        status: true,
        resultData: getUrlData
    })
})

router.post('/short', function(req,res,next) {
    try {
        const { longUrl } = req.body;
        if(!validUrl.isUri(longUrl)){
            return res.json({status: false, message: 'Invalid Url'})
        };

        const shortUrl = shortid.generate();
        const baseURL = `${process.env.BASE_URL}/${shortUrl}`;
        const resultData = fs.readFileSync('urls.json');
        const getUrlData = resultData.length === 0 || JSON.parse(resultData) === {} ? [] : JSON.parse(resultData);
        const findDuplicate = getUrlData.find(item => item.longUrl === longUrl);
        if(findDuplicate){
            return res.json({
                status:false,
                message: 'Url already exists'
            })
        }
        const objUrl = { urlId: shortUrl, longUrl, shortUrl: baseURL, clicks: 0};
        getUrlData.push({...objUrl});
        console.log(getUrlData);
        fs.writeFileSync('urls.json', JSON.stringify(getUrlData));
        return res.json({
            status: true,
            result: objUrl
        });
    } catch(err) {
        return res.json({status: false, message: err})
    }
})

router.get('/:urlId', function(req,res,next) {
    try {
        const { urlId } = req.params;
        const getData = fs.readFileSync('urls.json');
        const jsonUrlData = getData.length === 0 || JSON.parse(getData) === {} ? [] : JSON.parse(getData);
        if(jsonUrlData.length === 0) {
            return res.json({status: false, message: 'No Records Found'})
        }
        const findData = jsonUrlData.find(urlInfo => urlInfo.urlId === urlId);
        if(!findData){
            return res.json({ status: false, message: 'No records in the urlId'})
        }
        const updatedUrlData = jsonUrlData.map(item =>{
            if(item.urlId === urlId){      
                return {
                    ...item,
                    clicks: item.clicks + 1
                }  
            }
            return item;
        })
        fs.writeFileSync('urls.json', JSON.stringify(updatedUrlData));
        return res.redirect(findData.longUrl);
    } catch(err) {
        return res.json({status: false, message: err})
    }
})

router.delete('/:urlId', function(req,res, next) {
    try {
        const { urlId }= req.params;
        const getData = fs.readFileSync('urls.json');
        const jsonUrlData = getData.length === 0 || JSON.parse(getData) === {} ? [] : JSON.parse(getData);
        const filteredUrlData = jsonUrlData.filter(item => item.urlId !== urlId);
        fs.writeFileSync('urls.json', JSON.stringify(filteredUrlData));
        return res.json({status:true, resultData: filteredUrlData})
    } catch(err) {
        return res.json({status: false, message: err})
    }
})

module.exports = router; 