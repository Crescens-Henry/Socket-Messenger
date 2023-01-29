console.clear();
import net from "net";
const port = 3000;
const host = "192.168.0.30";

const client = new net.Socket();
client.connect(port, host);

client.on("data", (data) => {
  console.log(data.toString().trim());
}); // ! el que recibe los msj de los otros usuarios

client.on("connect", () => {
  process.stdin.on("data", (data) => {
    client.write(data.toString().trim());
  });
}); //! metodo para leer la consola

client.on("error", (err) => {
  if (err.errno == -4077) {
    console.log("Se ha perdido comunicación con el servidor");
  } else {
    console.error(err);
  }

  process.exit(0);
});
