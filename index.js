const { Kafka } = require("kafkajs");
const { SchemaRegistry } = require("@kafkajs/confluent-schema-registry");

const registry = new SchemaRegistry({ host: "http://localhost:8081" });

// the kafka instance and configuration variables are the same as before

// Create the client with the broker list
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["127.0.0.1:9092"],
});

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
const consumer = kafka.consumer({ groupId: "my-apps14" });
let messagesArray = [];

const consume = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "protos_topic_cards",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      messagesArray.push(message.value.toString());
      console.log({
        topic,
        key: message.key.toString(),
        value: await registry.decode(message.value),
        headers: message.headers,
      });
    },
  });
};

consume();

var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.setHeader("Content-type", "text/html");
  res.send(`<h4>${messagesArray}</h4>`);
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
