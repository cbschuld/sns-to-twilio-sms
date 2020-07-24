import { SNSHandler, SNSEvent } from "aws-lambda";
import "source-map-support/register";
import { Twilio } from "twilio";

export const send: SNSHandler = async (event: SNSEvent) => {
  await Promise.all(event.Records.map((record) => {
    const subject = record.Sns.Subject;

    // CloudWatch Alarm Destructuring
    const {
      AlarmName: alarmName,
      NewStateValue: stateValue,
      NewStateReason: reason,
    } = JSON.parse(record.Sns.Message);

    const message = `[${subject}]: ${stateValue}: ${alarmName} (${reason})`;

    const client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    return client.messages.create({
      body: message,
      to: "+1XXX5554321",
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  }));
};
