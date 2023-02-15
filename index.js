// var mySwiper = new Swiper('.swiper-container', {
//     // 其他选项
//     pagination: {
//       el: '.swiper-pagination',
//     },
//   })
new Vue({
    el: '#app',
    data: {
        activeIndex: 0,
        messages: [
            'Lite 版基于原版修改，<a class="link link-primary" href="https://rapidupload.1kbtool.com/" target="_blank">点此打开原版</a>  ',
            '点击数字可以切换步骤',
            '可以在第五步的界面开启一键转存',
            '请允许弹出窗口',
            '如果一键转存失败，建议手动转存',
            '一般来说，第四步弹出窗口很长一串就成功了',
          ],
          currentMessage: '',
          messageIndex: 0,
        currentStep: 1,
        bdstoken: localStorage.getItem('Blink_bdstoken'),
        savePath: localStorage.getItem('Blink_savePath') ? localStorage.getItem('Blink_savePath') : '/',
        link: location.pathname.slice(1) + decodeURI(location.hash),
        raw_result: '',
        quickmode: localStorage.getItem('Quick_mode')
    },
    mounted() {
        let quickmode = this.quickmode
        if(quickmode == 'enabled'){
            // console.log(quickmode)
            this.currentStep = 4
            this.submitLink()
        }
        // console.log(quickmode)
        // this.startSlider();
        this.currentMessage = this.messages[this.messageIndex];
    setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[this.messageIndex];
    }, 3000);

    },
    methods: {
        // startSlider() {
        //     setInterval(() => {
        //       this.activeIndex = (this.activeIndex + 1) % this.items.length;
        //     }, 3000);
        //   },
        setCurrentStep(step) {
            this.currentStep = step;
          },
        set_quickmode(value){
            localStorage.setItem("Quick_mode",value);
            this.quickmode = value
        },
        get_result() {
            let str = this.raw_result
            let error = JSON.parse(str);
            let errno = error.errno;
            let msg = '';
            switch (errno) {
                case 0:
                    msg = '秒传成功';
                    break;
                case -6:
                    msg = '认证失败，请刷新百度网盘页面并确认 bdstoken 成功填写';
                    break;
                case -8:
                    msg = '路径下存在同名文件/文件夹，请切换';
                    break;
                case 20:
                case -10:
                    msg = '网盘容量已满';
                    break;
                case -7:
                    msg = '转存路径含有非法字符，请修改转存路径或者转存文件文件名';
                    break;
                case 404:
                case 31190:
                    msg = '秒传未生效';
                    break;
                default:
                    msg = '未知错误';
            }
            // return msg;
            alert(msg)
        },
        nextStep() {
            this.currentStep++
        },
        get_bdstoken() {
            if (this.bdstoken.length !== 32) {
                var json = JSON.parse(this.bdstoken);
                this.bdstoken = json.result.bdstoken;
            }
            this.nextStep()
        },
        submitLink() {
            let savePath = this.savePath;
            let bdstoken = this.bdstoken.trim();
            if (!(checkBdstoken(bdstoken) && checkPath(savePath))) return;
            if (savePath.charAt(savePath.length - 1) !== '/') savePath += '/';
            const data = DuParser.parse(this.link)
            if (!data.length) {
                alert('未检测到有效的秒传链接');
                return;
            }
            window.open('https://pan.baidu.com','_blank')
            setTimeout(function() {
                data.forEach(file => {
                    saveFile2(
                        file.md5,
                        file.size,
                        savePath + file.path.replace(illegalPathPattern, "_"),
                        bdstoken
                    );
                });
              }, 1000); // 1000毫秒等于1秒
            this.nextStep()
            console.log(this.currentStep)
        }
    }
})