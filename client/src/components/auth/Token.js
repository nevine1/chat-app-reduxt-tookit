import { parse } from "cookie";

export default function handler(req, res) {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token || null;

    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    return res.status(200).json({ token });
}
