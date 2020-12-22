import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import urlModel from './models/urls';

const app = express();
dotenv.config();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("Database connected")).catch(() => console.log("DB CONNECTION ERORR"));


app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: false}));

const generateShortUrl = async (fullUrl: string) => {
    const url = await urlModel.create({ full: fullUrl });
    return url;
}

app.get("/", async (req, res) => {
    const urls = await urlModel.find();
    res.render("index", { urls });
})



app.get("/g", async (req, res) => {
    const fullUrl = req.query.url as string;
    if (fullUrl) {
        const url = await generateShortUrl(fullUrl);
        console.log(fullUrl)
    }
    res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await urlModel.deleteOne({ _id: id});
    res.redirect("/");
})

app.get("/:url", async(req, res) => {
    const url = await urlModel.findOne({ short: req.params.url });
    // console.log(url.toObject());

    if (!url) return res.redirect("/");

    url.clicks++;
    url.save();

    res.redirect(url.full);
})

app.post("/shortUrls", async (req, res) => {
    // console.log(req.body.fullUrl)
    // const ˛˛result = await urlModel.create({ full: req.body.fullUrl });
    await generateShortUrl(req.body.fullUrl);

    res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => console.log("Server started"))