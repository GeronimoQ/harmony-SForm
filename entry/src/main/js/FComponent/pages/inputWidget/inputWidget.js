export default {
    props:{
      widgetConfig:{
          default:null
      }
    },
    data: {
       widgetInfo:{
           value:'',
           widgetCopy:''
       }
    },
    submitValue(){
        let data={
            fillData:this.widgetInfo.value
        }
        this.$emit("fillData",data);
    },

   async  valueChange(value){
        this.widgetInfo.value=value.value
        await this.submitValue()
    },
//    new Date(year, month, day, hours, minutes, seconds, milliseconds)
    async valueChangePicker_date(date){
//        { year: year, month: month, day: day, hour: hour, minute: minute}
        let value=new Date(date.year,date.month,date.day,date.hour,date.minute,null,null);
        this.widgetInfo.value=value;
        await this.submitValue()
    },
   async valueChangePicker_time(time){
//        { hour: hour, minute: minute, [second: second] }
        let value=new Date(null,null,null,time.hour,time.minute,null,null);
        this.widgetInfo.value=value;
        await this.submitValue()
    }


}
