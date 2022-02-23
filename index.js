const { Kafka } = require("kafkajs");
const { SchemaRegistry } = require("@kafkajs/confluent-schema-registry");
const express = require("express");
const registry = new SchemaRegistry({ host: "http://localhost:8081" });

// Create the client with the broker list
const kafka = new Kafka({
  clientId: "my-proto-app",
  brokers: ["127.0.0.1:9092"],
});

// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
const consumer = kafka.consumer({ groupId: "proto-topic-consumer" });

let messagesArray = [];

const consume = async () => {
  await consumer.connect();
  // Subscribe to our Topic
  // fromBeginning flag to consume messages from start
  // for more on this see: https://kafka.js.org/docs/consuming#frombeginning
  await consumer.subscribe({
    topic: "protos_topic_cards",
    fromBeginning: true,
  });
  // Run our consumer
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Push messages to messagesArray after decoded
      messagesArray.push(await registry.decode(message.value));

      // Log details on our console (optional)
      // Notice there is no need to convert to JSON here
      console.log({
        topic,
        key: message.key.toString(),
        value: await registry.decode(message.value),
        headers: message.headers,
      });
    },
  });
};

// Run our consumer
consume();

var app = express();

// Create the "/" route response
app.get("/", function (req, res) {
  res.setHeader("Content-type", "text/html");
  // In a JSON format to be able to display in the browser
  res.send(
    messagesArray
      .map((message) => {
        return `<h4>${JSON.stringify(message)}</h4>`;
      })
      .join(" ")
  );
});

// Listen on port 5000
var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Log to make sure server started successfully
  console.log("Example app listening at http://%s:%s", host, port);
});
