# Hướng dẫn deploy server

Bước 1: `cd` đến thư mục `scripts` sau đó chạy lệnh
`sh build-push-docker-image.sh`
Mọi người tạo repository trên DockerHub. Hiện tại thì em đang dùng repository của em `lekhacthanhtung/actionx-be`. Account docker của người nào thì mới up được repo của người đó. Sau này em sẽ chuyển qua dùng AWS ECR thì tiện hơn.

Bước 2: Sau push docker image lên dockerhub xong, mọi người truy cập EC2 thông qua SSH. Key thì mọi người nhắn em.

Bước 3: Mọi người xoá container đang chạy bằng lệnh `sudo docker rm -f <CONTAINER_ID>`

Rồi xoá luôn cái image hiện tại để pull cái mới nhất về `sudo docker rmi <IMAGE_ID>`

Sau đó chạy script sau
```
sudo docker run -it -d \
  --name actionx-be \
  -e VIRTUAL_HOST="server.actionxapt.com" \
  -e VIRTUAL_PORT=80 \
  -e LETSENCRYPT_HOST="server.actionxapt.com" \
  -e LETSENCRYPT_EMAIL="weminal@gmail.com" \
  lekhacthanhtung/actionx-be
```

lekhacthanhtung/actionx-be -> có thể thay thành repository của mọi người trên DockerHub.

`Note`: Sau này có thời gian thì em sẽ setup ci/cd cho tiện