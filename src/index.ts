import client, {Connection, Channel, ConsumeMessage} from 'amqplib'

const sendMessages = (channel: Channel) => {
    for (let i = 0; i < 10; i++) {
        channel.sendToQueue('myQueue', Buffer.from(`message ${i}`))
    }
}

const consumer = (channel: Channel) => (msg: ConsumeMessage | null): void => {
    if (msg) {
        console.log(msg.content.toString())
        channel.ack(msg)
    }
}

const go = async () => {
    const conn: Connection = await client.connect('amqp://guilhermeDev:1234@localhost:5672')
    const channel: Channel = await conn.createChannel()
    await channel.assertQueue('myQueue')
    sendMessages(channel)
    await channel.consume('myQueue', consumer(channel))
}

go()