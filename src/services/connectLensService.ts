import * as AWS from "aws-sdk";
import { ConnectContactLensClient, ListRealtimeContactAnalysisSegmentsCommand } from "@aws-sdk/client-connect-contact-lens"; // ES Modules import
import { access } from 'fs'
//en config todavia no tenemos estas access keys
import {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} from '../config/index';

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID, 
    secretAccessKey: AWS_SECRET_ACCESS_KEY, 
    region: AWS_REGION
});

//Instancia Amazon Connect
const connectLens = new AWS.ConnectContactLens();

export default connectLens;