# Tugas

Tambahkan Performance Service pada aplikasi yang sudah dibuat sebelumnya

![service diagram](tugas-besar-task-system.png)

1. performance service
    menyediakan informasi mengenai histori transaksi yang dilakukan
    - simpan segala aktivitas transaksi di dalam KV
    - dapat diagregasi dengan menampilkan jumlah task dan worker yang dibuat, dihapus, diupdate (jika ada) 
    dalam kurun waktu tertentu (misalkan 1 hari, 1 minggu, tgl 1 sampai 12)

2. object storage
    menggunakan minio untuk upload file
    - ganti file system ke object storage
