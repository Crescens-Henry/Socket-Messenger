console.clear();
import { log } from "console";
import net from "net";

const server = net.createServer();
const arrayUsers = [];
const port = 3000;
const host = "192.168.0.30";
const nickNames = {};

server.on("connection", (client) => {
  if (nickNames[client.remoteAddress] === undefined) {
    nickNames[client.remoteAddress] = client.remoteAddress;
    client.write("Escribe tu nombre de usuario");
  }

  arrayUsers.push(client);

  console.log("se ha conectado: " + nickNames[client.remoteAddress]);
  client.on("data", (data) => {
    if (nickNames[client.remoteAddress] === client.remoteAddress) {
      nickNames[client.remoteAddress] = data.toString().trim();
      client.write("tu nickName ahora es: " + nickNames[client.remoteAddress]);
      return;
    }
    for (const key in arrayUsers) {
      if (arrayUsers[key].remoteAddress === client.remoteAddress) continue;
      arrayUsers[key].write(nickNames[client.remoteAddress] + ":" + data);
    }
    console.log(nickNames[client.remoteAddress] + " : " + data);
  });

  client.on("close", () => {
    arrayUsers.map((un_usuario) => {
      un_usuario.write(
        nickNames[client.remoteAddress] + " ha salido del servidor"
      );
    });
  });

  client.on("error", (err) => {
    if (err.errno == -4077) {
      arrayUsers.map((un_usuario) => {
        un_usuario.write(
          nickNames[client.remoteAddress] + " ha salido del servidor"
        );
      });

      console.log(nickNames[client.remoteAddress] + " ha salido del servidor");
    } else {
      console.error(err);
    }
  });
});
server.on("error", (err) => {
  console.log(err);
});

server.listen(port, host, () => {
  console.log("Servidor a la escucha");
});
