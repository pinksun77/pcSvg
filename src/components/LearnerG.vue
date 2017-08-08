<template>
  <div class="learner">
    <div class="pdfBox" style="width: 50%; float:left">
      <div class="pageMinus" @click="minusPage">-</div>
      <div class="pageAdd" @click="addPage">+</div>
      <div v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center"
           :style="{ width: loadedRatio * 100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%
      </div>
      <pdf class="pdf" v-if="show" ref="pdf" style="border: 1px solid red" :src="src" :page="page" :rotate="rotate"
           @password="password" @progress="loadedRatio = $event" @error="error" @numPages="numPages = $event"></pdf>
      <div >
        <!--<input type="checkbox" v-model="show">-->
        <!--  <select v-model="src" style="width: 30em">
            <option v-for="item in pdfList" :value="item" v-text="item"></option>
          </select>-->
        第<input v-model.number="page" type="number" style="width: 3em">页 /总共{{numPages}}页
        <!--<button @click="rotate += 90">&#x27F3;</button>
        <button @click="rotate -= 90">&#x27F2;</button>-->
        <!--<button @click="$refs.pdf.print()">print</button>-->

      </div>
    </div>

    <div class="questionBox">
      <h1>试题</h1>
      <div style="text-align: center;margin-bottom: 10px" >
        第<input v-model.number="page" type="number" style="width: 3em;position: relative;top:-2px;margin-left: 4px;margin-right: 4px">页 /总共{{numPages}}页

      </div>
      <table v-for="(questionPage,index) in pages">
        <tr v-for="(question,index) in questionPage.questions" v-show="questionPage.pageNum == page">
          <!--<td>{{index+1}}</td>-->
          <td>{{question.questionCode}}</td>
          <td><el-button type="primary" @click="delQuestion(index)" class="delBtn">删除</el-button></td>
          <td>
            <el-select v-model="question.questionType" @change="initAnswer(question)" class="selectStyle">
              <el-option v-for="item in questionTypeSelect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="question.selectionNum" v-if="question.questionType == 1" @change="initAnswer(question)" class="selectStyle">
              <el-option v-for="item in choseNum"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <el-select v-model="question.selectionNum" v-if="question.questionType == 2" @change="initAnswer(question)" class="selectStyle">
              <el-option v-for="item in choseNum"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </td>

          <td>
            <el-radio-group v-model="question.answer" v-if="question.selectionNum == 2&&question.questionType == 1">
              <el-radio-button label="A"></el-radio-button>
              <el-radio-button label="B"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="question.answer" v-if="question.selectionNum == 3&&question.questionType == 1"
                            @change="con">
              <el-radio-button label="A"></el-radio-button>
              <el-radio-button label="B"></el-radio-button>
              <el-radio-button label="C"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="question.answer" v-if="question.selectionNum == 4&&question.questionType == 1">
              <el-radio-button label="A"></el-radio-button>
              <el-radio-button label="B"></el-radio-button>
              <el-radio-button label="C"></el-radio-button>
              <el-radio-button label="D"></el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="question.answer" v-if="question.selectionNum == 5&&question.questionType == 1">
              <el-radio-button label="A"></el-radio-button>
              <el-radio-button label="B"></el-radio-button>
              <el-radio-button label="C"></el-radio-button>
              <el-radio-button label="D"></el-radio-button>
              <el-radio-button label="F"></el-radio-button>
            </el-radio-group>


            <el-checkbox-group v-model="question.answers" v-if="question.selectionNum == 2&&question.questionType == 2">
              <el-checkbox-button label="A"></el-checkbox-button>
              <el-checkbox-button label="B"></el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="question.answers" v-if="question.selectionNum == 3&&question.questionType == 2"
                               @change="con">
              <el-checkbox-button label="A"></el-checkbox-button>
              <el-checkbox-button label="B"></el-checkbox-button>
              <el-checkbox-button label="C"></el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="question.answers" v-if="question.selectionNum == 4&&question.questionType == 2">
              <el-checkbox-button label="A"></el-checkbox-button>
              <el-checkbox-button label="B"></el-checkbox-button>
              <el-checkbox-button label="C"></el-checkbox-button>
              <el-checkbox-button label="D"></el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="question.answers" v-if="question.selectionNum == 5&&question.questionType == 2">
              <el-checkbox-button label="A"></el-checkbox-button>
              <el-checkbox-button label="B"></el-checkbox-button>
              <el-checkbox-button label="C"></el-checkbox-button>
              <el-checkbox-button label="D"></el-checkbox-button>
              <el-checkbox-button label="F"></el-checkbox-button>
            </el-checkbox-group>
          </td>
          <!--<td>{{question.answer}}</td>-->
          <!--<td>{{question.answers}}</td>-->
        </tr>
      </table>
      <div>
        <el-button class="addQuestionBtn" type="primary" @click="addQuestion">添加题目</el-button>
        <el-button class="submitBtn" type="primary" @click="submitQuestion" v-show="page == pages.length">提交题目</el-button>

      </div>
    </div>
  </div>
</template>
<script>
  //import CryptoJS from '../../data/aes/aes.js'
  var JSZip = require("jszip");
  import mixinGlobal from '../mixin/mixinGlobal.js'
  //import svgData from '../../data/canvas.json';
  import pdf from 'vue-pdf'

  var svgData = {}
  export default {
    name: 'learner',
    data () {
      console.log(svgData);
      var svgHeight = svgData.initialHeight * 2 + "px";
      var svgWidth = svgData.initialWidth * 2 + "px";
      var svgFounts = svgData.linesBeforeRecord;
      var svgRs = [];
      console.log(svgData);
      var vx = 0;
      var vy = 0;
      var vw = 600;
      var vh = 600;
      var pages = [
        {
          pageNum: 1,
          questions: [
            {
              questionCode: 1,
              questionType: 1,
              selectionNum: 4,
              answer: "",
              answers: []
            }
          ]
        },
        {
          pageNum: 2,
          questions: [
            {
              questionCode: 1,

              questionType: 1,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            },
            {
              questionType: 1,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            }
          ]
        },
        {
          pageNum: 3,
          questions: [
            {
              questionType: 2,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            },
            {
              questionType: 1,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            }
          ]
        },
        {
          pageNum: 4,
          questions: [
            {
              questionType: 1,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            },
            {
              questionType: 1,
              selectionNum: 4,
              answers: "A",
              answer: ["A", "B"]
            }
          ]
        },

      ];
      var questionTypeSelect = [
        {value: 1, label: "单选"},
        {value: 2, label: "多选"},
        {value: 3, label: "填空"},
      ];
      var choseNum = [
        {value: 2, label: "2个选项"},
        {value: 3, label: "3个选项"},
        {value: 4, label: "4个选项"},
        {value: 5, label: "5个选项"},
      ]
      return {
        dataFiles: [],
        dataFile: {},
        AESDataFiles: {},
        dateObj: {},
        base64Data: "",

        svgHeight: svgHeight,
        svgWidth: svgWidth,
        svgFronts: svgFounts,
        svgRs: [],
        svgAll: [],
        svgAllPlay: [],

        startTimeTime: 0,
        startTimeDraw: 0,
        vx: vx,
        vy: vy,
        vw: vw,
        vh: vh,
        audioSrc: "",


        show: true,
        pdfList: [
          '',
          'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/freeculture.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/annotation-link-text-popup.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/calrgb.pdf',
          'https://cdn.rawgit.com/sayanee/angularjs-pdf/68066e85/example/pdf/relativity.protected.pdf',
          'data:application/pdf;base64,JVBERi0xLjUKJbXtrvsKMyAwIG9iago8PCAvTGVuZ3RoIDQgMCBSCiAgIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nE2NuwoCQQxF+/mK+wMbk5lkHl+wIFislmIhPhYEi10Lf9/MVgZCAufmZAkMppJ6+ZLUuFWsM3ZXxvzpFNaMYjEriqpCtbZSBOsDzw0zjqPHZYtTrEmz4eto7/0K54t7GfegOGCBbBdDH3+y2zsMsVERc9SoRkXORqKGJupS6/9OmMIUfgypJL4KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCiAgIDEzOAplbmRvYmoKMiAwIG9iago8PAogICAvRXh0R1N0YXRlIDw8CiAgICAgIC9hMCA8PCAvQ0EgMC42MTE5ODcgL2NhIDAuNjExOTg3ID4+CiAgICAgIC9hMSA8PCAvQ0EgMSAvY2EgMSA+PgogICA+Pgo+PgplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvUGFnZQogICAvUGFyZW50IDEgMCBSCiAgIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NTc0IDg0MS44ODk3NzEgXQogICAvQ29udGVudHMgMyAwIFIKICAgL0dyb3VwIDw8CiAgICAgIC9UeXBlIC9Hcm91cAogICAgICAvUyAvVHJhbnNwYXJlbmN5CiAgICAgIC9DUyAvRGV2aWNlUkdCCiAgID4+CiAgIC9SZXNvdXJjZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzCiAgIC9LaWRzIFsgNSAwIFIgXQogICAvQ291bnQgMQo+PgplbmRvYmoKNiAwIG9iago8PCAvQ3JlYXRvciAoY2Fpcm8gMS4xMS4yIChodHRwOi8vY2Fpcm9ncmFwaGljcy5vcmcpKQogICAvUHJvZHVjZXIgKGNhaXJvIDEuMTEuMiAoaHR0cDovL2NhaXJvZ3JhcGhpY3Mub3JnKSkKPj4KZW5kb2JqCjcgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cKICAgL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA1ODAgMDAwMDAgbiAKMDAwMDAwMDI1MiAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyMzAgMDAwMDAgbiAKMDAwMDAwMDM2NiAwMDAwMCBuIAowMDAwMDAwNjQ1IDAwMDAwIG4gCjAwMDAwMDA3NzIgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA4CiAgIC9Sb290IDcgMCBSCiAgIC9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgo4MjQKJSVFT0YK',
        ],
        src: './static/24.pdf',
        loadedRatio: 0,
        page: 1,
        numPages: 0,
        rotate: 0,
        password: 0,
        pages: pages,
        questionTypeSelect: questionTypeSelect,
        choseNum: choseNum,
        radio3: []
      }
    },
    mixins: [mixinGlobal],
    mounted: function () {


    },

    computed: {},
    methods: {
      con(){
        console.log(this.radio3)
      },
      addPage(){
        if (this.page < this.numPages) {
          this.page = this.page + 1
        }
      },
      minusPage(){
        if (this.page > 1) {
          this.page = this.page - 1
        }
      },

      unZip(data){
        var _this = this;
        var zip1 = new JSZip();
        zip1.loadAsync(this.dataFile)
          //zip1.loadAsync(data)
          .then(function (file) {
            console.log("file>>>", file);

            // you now have every files contained in the loaded zip
            zip1.file("canvas.json").async("string") // 此处是压缩包中的testTXT.txt文件，以string形式返回其内容，此时已经可以获取zip中的所有文件了
              .then(function (content) {
                // use content
                //alert(content)
                _this.dataObjStr = content;
                _this.dataObj = JSON.parse(content);
                console.log("解压后对象", _this.dataObj);
                console.log("解压后字符串", _this.dataObjStr);
                _this.startPlay();
              });
          });
      },
      unGZip(data){
        var _this = this;
        var data1 = this.dataFile;
        var uint8array = new Uint8Array(data1).buffer;
        console.log("Zlib", Zlib)
        console.log("uint8array", uint8array)
        var fileReader = new FileReader(); //实例化FileReader
        fileReader.onloadend = function () { //加载完成后执行
          var result = null;
          var callback = function () {

          };
          if (fileReader.readyState === FileReader.DONE) { //判断操作是否完成
            result = fileReader.result; //获取结果
            console.log("result>>", result);
            var x2 = new Uint8Array(result);

            var gunzip = new Zlib.Gunzip(x2);
            var plain = gunzip.decompress();
            console.log("plain1", plain)
            var fileStr = new TextDecoder("utf-8").decode(plain);
            var json = JSON.parse(fileStr)
            console.log("plain1string", json)
            _this.dataObj = json;
            setTimeout(function () {
              console.log("plain2", plain)

            }, 10000)
          }
          if (callback) {
            callback(result);
          }
        };
        fileReader.readAsArrayBuffer(data1); //以二进制的方式读取文件

        /**/
      },

      dataChange(){
        //alert(1);
        if (this.$refs.data.files && this.$refs.data.files.length) {
          this.dataFile = this.$refs.data.files[0];
          console.log("dataFile", this.dataFile);
          console.log("name", this.dataFile.name);
          console.log("size", this.dataFile.size);
          console.log("type", this.dataFile.type);
        }
      },
      error(){
      },
      initAnswer(question){
        question.answer = "";
        question.answers = []
      },
      addQuestion(){
        var questionItem = {
          questionType: 1,
          selectionNum: 4,
          answer: "",
          answers: ["A", "B"]
        };
        this.pages[this.page - 1].questions.push(questionItem)
      },
      delQuestion(index){
        //console.log("del-index-item",index,this.pages[this.page].questions)
        this.pages[this.page - 1].questions.splice(index,1)
      },
      submitQuestion(){
        console.log(this.pages);
        var noQ = [];

        for(let i=0; i<this.pages.length; i++){
          if(this.pages[i].questions.length == 0){
            noQ.push(i+1)
          }
        }
        if(noQ.length>0){
          this.$confirm('第'+noQ+'页未添加题目, 是否继续提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消提交'
          });
        });
        }else {

        }
      }

    },
    components: {pdf},
    watch: {
      numPages: function(val,oldval){
        this.pages = [];
        for(let i=0; i<val ; i++){
          var item =  {
            pageNum: i+1,
            questions: [

            ]
          };
       this.pages.push(item);
        }
      },
      pages: {
        handler: function (val, oldVal) {
          /*{
            pageNum: 3,
              questions: [
            {
              questionType: 2,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            },
            {
              questionType: 1,
              selectionNum: 4,
              answer: "A",
              answers: ["A", "B"]
            }
          },*/
var count = 1;
          for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < val[i].questions.length; j++) {
              //var count = 0;
              /*for(let k = 0; j < val.length; i++){

              }*/
              val[i].questions[j].questionCode = count
              count=count+1
            }
          }
        },
        deep: true
      }
    }


  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  .pdfBox {
    position: relative;
  }

  .pageMinus {
    position: absolute;
    left: 2%;
    top: 50%;
    z-index: 1000;
    font-size: 50px;
  }

  .pageAdd {
    position: absolute;
    right: 2%;
    top: 50%;
    z-index: 1000;
    font-size: 50px;
  }
  .questionBox {
    h1{
      margin: 20px auto;
      text-align: center;
    }
    float: right;
    width: 50%;
    table{
      tr{
       // padding-bottom:30px!important;
      height:50px!important;
      //border-bottom: 1px solid #000000


  td:nth-of-type(1){
          padding-left: 2em;
          padding-right: 2em;
        }
      }
    }
  .addQuestionBtn{
    margin: 15px 77px;
  }
  }

  .selectStyle{
    width: 100px;
  }
  .delBtn{
    width: 90px;
  }
</style>
