const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})
const uuidV4 = require('uuid/v4')
const translate = new AWS.Translate();
const polly = new AWS.Polly();
const s3 = new AWS.S3({
  params: {
    Bucket: 'YOURBUCKETNAME',
  }
})

exports.handler = (event, context, callback) => {
  // Step 1: translate the text
  let message = ''
  const translateParams = {
    SourceLanguageCode: 'en',
    TargetLanguageCode: event.code,
    Text: event.sentence
  }
  
  translate.translateText(translateParams, function (err, data) {
    if (err) callback(err)
    message = data.TranslatedText

    const voices = {
      'es': 'Penelope',
      'pt': 'Vitoria',
      'de': 'Vicki',
      'en': 'Joanna',
      'fr': 'Celine'
    }

    const voice = voices[event.code]

    const pollyParams = {
      OutputFormat: "mp3", 
      SampleRate: "8000", 
      Text: message,
      TextType: "text", 
      VoiceId: voice
    };

    // step 2: synthesize the translation into speech  
    polly.synthesizeSpeech(pollyParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else  {
        let key = uuidV4()
        const params2 = {
          Key: key,
          ContentType: 'audio/mpeg',
          Body: data.AudioStream,
          ACL: 'public-read'
        };
        s3.putObject(params2, function(err, data) {
          if (err) {
            callback('error putting item: ', err)
          } else {
            callback(null, { sentence: key })
          }
        });
      }
    });
  });  
};
