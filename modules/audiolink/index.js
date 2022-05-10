import process from "process";
import portAudio from "naudiodon";
import FFT from "fft-js";

const ai = null;
const devices = portAudio.getDevices();
const bufferSize = Math.pow( 2, 11 );

const FreqFloor = 0.123;
const FreqCeiling = 1;

const BassFreq = 25;
const BassBandLength = 10;

const LowMidFreq = 200;
const LowMidBandLength = 13;

const HighMidFreq = 300;
const HighMidBandLength = 38;

const TrebleFreq = 1000;
const TrebleBandLength = 187;
let BandData = [ 0, 0, 0, 0 ];

const rsDevice = {
    index: -1,
    name: "",
    maxInputChannels: -1,
    defaultSampleRate: 44100
};

let size = 4096; //fft size
let fft = new FFT( size ); //create fft object
let realOutput = new Array( size ); // to store final result
let complexOutput = fft.createComplexArray(); // to store fft output

for ( let i = 0; i < devices.length; i += 1 ) {
    const device = devices[i];
    console.log( device );
    if ( device.name.includes( "VoiceMeeter Output (VB-Audio Vo" ) ) {
        console.log( "chosen", device );
        rsDevice.index = device.id;
        rsDevice.name = device.name;
        rsDevice.maxInputChannels = device.maxInputChannels;
        break;
    }
}

function ConvertMinMax( x, in_min, in_max, out_min, out_max )
{
    return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function aiStream( rsDevice ) {
    const ai = new portAudio.AudioIO( {
        inOptions: {
            channelCount: rsDevice.maxInputChannels,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: rsDevice.defaultSampleRate,
            deviceId: rsDevice.index, // Use -1 or omit the deviceId to select the default device
            closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
        }
    } );
    return ai;
}

const stream = aiStream( rsDevice );

stream.on( "data", buf => {
    console.log( buf );
} );

process.on( "SIGINT", () => {
    console.log( "Received SIGINT. Stopping recording." );
    stream.quit();
} );

stream.start();