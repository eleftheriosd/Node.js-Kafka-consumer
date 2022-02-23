# Node.JS Kafka consumer utilizing Lenses Box

Set things up by running:

1. ## npm install

2. ## npm run dev

---

In our example the broker lives at: `127.0.0.1:9092` and the Schema Registry: `127.0.0.1:8081`. You might need to customise those based on your scenario. Here we are using [Lenses Box](https://lenses.io/apache-kafka-docker) that takes care of exporting the above ports for us.

---

The encoded payload contains the schema id of the schema used to decode it, so to decode, simply call registry.decode with the encoded payload. The corresponding schema will be downloaded from the registry if needed in order to decode the payload.
