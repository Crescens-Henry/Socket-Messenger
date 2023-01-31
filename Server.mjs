console.clear();
import { log } from "console";
import net from "net";
import chalk from "chalk";

const server = net.createServer();
const arrayUsers = [];
const port = 3000;
const host = "192.168.0.30";
const nickNames = {};

server.on("connection", (client) => {
  if (nickNames[client.remoteAddress] === undefined) {
    nickNames[client.remoteAddress] = {
      nickName: client.remoteAddress,
      R: Math.ceil(Math.random() * 255),
      G: Math.ceil(Math.random() * 255),
      B: Math.ceil(Math.random() * 255),
    };
    client.write(chalk.bgBlue.bold("Escribe tu nombre de usuario"));
  }

  arrayUsers.push(client);

  console.log(
    "se ha conectado: " +
      chalk
        .rgb(
          nickNames[client.remoteAddress].R,
          nickNames[client.remoteAddress].G,
          nickNames[client.remoteAddress].B
        )
        .underline(nickNames[client.remoteAddress].nickName)
  );
  client.on("data", (data) => {
    if (nickNames[client.remoteAddress].nickName === client.remoteAddress) {
      nickNames[client.remoteAddress].nickName = data.toString().trim();
      client.write(
        chalk
          .rgb(
            nickNames[client.remoteAddress].R,
            nickNames[client.remoteAddress].G,
            nickNames[client.remoteAddress].B
          )
          .underline(
            "ahora tu nickname es: " + nickNames[client.remoteAddress].nickName
          )
      );
      return;
    }
    for (const key in arrayUsers) {
      if (arrayUsers[key].remoteAddress === client.remoteAddress) continue;
      arrayUsers[key].write(
        chalk
          .rgb(
            nickNames[client.remoteAddress].R,
            nickNames[client.remoteAddress].G,
            nickNames[client.remoteAddress].B
          )
          .underline(nickNames[client.remoteAddress].nickName) +
          ":" +
          data
      );
    }

    console.log(
      chalk
        .rgb(
          nickNames[client.remoteAddress].R,
          nickNames[client.remoteAddress].G,
          nickNames[client.remoteAddress].B
        )
        .underline(nickNames[client.remoteAddress].nickName) +
        ":" +
        data
    );
  });

  client.on("error", (err) => {
    if (err.errno == -4077) {
      arrayUsers.map((un_usuario) => {
        un_usuario.write(
          chalk
            .rgb(
              nickNames[client.remoteAddress].R,
              nickNames[client.remoteAddress].G,
              nickNames[client.remoteAddress].B
            )
            .underline(nickNames[client.remoteAddress].nickName) +
            " ha salido del servidor"
        );
      });

      console.log(
        chalk
          .rgb(
            nickNames[client.remoteAddress].R,
            nickNames[client.remoteAddress].G,
            nickNames[client.remoteAddress].B
          )
          .underline(nickNames[client.remoteAddress].nickName) +
          " ha salido del servidor"
      );
    } else {
      console.error(err);
    }
  });
});
server.on("error", (err) => {
  console.log(err);
});

server.listen(port, host, () => {
  console.log("Servidor a la escucha \nPuerto-> " + port + "\nHost->" + host);
});
