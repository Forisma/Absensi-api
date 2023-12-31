import mongoose from "mongoose";

const absensiSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        default: "Dzuhur",
    },
    status: {
        type: Boolean,
        default: false,
    },
    openedBy: {
        type: String,
        default: "Anon",
    },
    note: {
        type: String,
        default: "",
    },
    users: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        nama: { type: String, default: null },
        absen: { type: Boolean, default: null },
        kelas: { type: String, default: '' },
        nomorKelas: { type: String, default: '' },
        kode: {
            type: String,
            enum: ["I", "S", "A", "H", "-"],
            default: "-",
        },
        keterangan: {
            type: String,
            default: "",
        },
        waktuAbsen: {
            type: Date,
            default: new Date(),
        },
        koordinat: {
            type: [Number],
            default: [0, 0],
        }
    }],
});

const Absensi = mongoose.model("Absensi", absensiSchema);

export default Absensi;
