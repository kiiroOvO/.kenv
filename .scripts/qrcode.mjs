// Users/liam/.kenv/scripts/qrcode.ts
import "@johnlindquist/kit";
import { promisify } from "util";
var { toDataURL } = await npm("qrcode");
var text = await arg("input text to get qrcode");
var width = 300;
var toDataURLPromise = promisify(
  (...args) => toDataURL(...args)
);
var url = await toDataURLPromise(text, { width });
var img = `<img src="${url}" alt="Generate failed" width="${width}" height="${width}" />`;
await widget(`<div>${img}</div>`, {
  width,
  height: width
});
