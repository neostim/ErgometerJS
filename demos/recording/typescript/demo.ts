/**
 * Demo of Concept 2 ergometer Performance Monitor
 *
 * This will will work with the PM5
 *
 * This unit contains some demo code which can both run on electron and cordova
 *
 * Created by tijmen on 01-06-15.
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Demo {

    private _performanceMonitor : ergometer.PerformanceMonitorBle;
    private _lastDeviceName : string = null;
    public get performanceMonitor(): ergometer.PerformanceMonitorBle {
        return this._performanceMonitor;
    }

    public get lastDeviceName() : string {
        if (!this._lastDeviceName) {

            var value=localStorage.getItem("lastDeviceName");
            if (value=="undefined" || value=="null" || value==null)
                this._lastDeviceName="";
            else this._lastDeviceName=value;
        }
        return this._lastDeviceName;
    }
    public set lastDeviceName(value : string) {
        if (this._lastDeviceName!=value) {
            this._lastDeviceName=value;
            localStorage.setItem("lastDeviceName",value);
        }

    }
    /**
     * Print debug info to console and application UI.
     */
    public addText(id : string, text : string) {
        var ctrl=$("#"+id);
        var txtCtrl=$("<p/>");
        txtCtrl.text(text);
        ctrl.prepend(txtCtrl);
    }
    

    public showData(data : string)
    {
        this.addText("data",data);
    }

    protected initialize() {
        this._performanceMonitor= new ergometer.PerformanceMonitorBle();
        //this.performanceMonitor.multiplex=true; //needed for some older android devices which limited device capablity. This must be set before conneting
        //this.performanceMonitor.logLevel=ergometer.LogLevel.trace; //by default it is error, for more debug info  change the level
        this.performanceMonitor.logEvent.sub(this,this.onLog);
        this.performanceMonitor.connectionStateChangedEvent.sub(this,this.onConnectionStateChanged);
        //connect to the rowing
        this.performanceMonitor.rowingGeneralStatusEvent.sub(this,this.onRowingGeneralStatus);
        this.performanceMonitor.rowingAdditionalStatus1Event.sub(this,this.onRowingAdditionalStatus1);
        this.performanceMonitor.rowingAdditionalStatus2Event.sub(this,this.onRowingAdditionalStatus2);
        this.performanceMonitor.rowingStrokeDataEvent.sub(this,this.onRowingStrokeData);
        this.performanceMonitor.rowingAdditionalStrokeDataEvent.sub(this,this.onRowingAdditionalStrokeData);
        this.performanceMonitor.rowingSplitIntervalDataEvent.sub(this,this.onRowingSplitIntervalData);
        this.performanceMonitor.rowingAdditionalSplitIntervalDataEvent.sub(this,this.onRowingAdditionalSplitIntervalData);
        this.performanceMonitor.workoutSummaryDataEvent.sub(this,this.onWorkoutSummaryData);
        this.performanceMonitor.additionalWorkoutSummaryDataEvent.sub(this,this.onAdditionalWorkoutSummaryData);
        this.performanceMonitor.heartRateBeltInformationEvent.sub(this,this.onHeartRateBeltInformation);
        this.performanceMonitor.additionalWorkoutSummaryData2Event.sub(this,this.onAdditionalWorkoutSummaryData2);
        this.performanceMonitor.powerCurveEvent.sub(this,this.onPowerCurve);

        $("#startRecording").click(()=>{this.startRecording()});
        $("#stopRecording").click(()=>{this.stopRecording()});
        $("#replay100meter").click(()=>{this.replay100meter()});
        $("#StartScan").click(()=>{
            this.startScan()
        });
        $("#getinfo").click(this.csafeTest.bind(this));
        
    }
    public startRecording() {
        this.performanceMonitor.recording=true;
        this.startScan();
    }
    public stopRecording() {
        this.performanceMonitor.disconnect();
        this.performanceMonitor.recording=false;
        console.log("Recording:");
        console.log(JSON.stringify(this.performanceMonitor.recordingEvents, null, '\t')  );
        console.log("EndRecording");
    }

    public replay100meter() {
        this.performanceMonitor.replay(ergometer.recording.row100meter);
        this.startScan();//start scan will receive every thing from the recording, and start the connection sequence

    }
    public onLog(info : string,logLevel : ergometer.LogLevel)
    {   this.showData(info);
    }

    protected onRowingGeneralStatus(data : ergometer.RowingGeneralStatus) {
        this.showData('RowingGeneralStatus:'+JSON.stringify(data));

    }
    protected onRowingAdditionalStatus1(data : ergometer.RowingAdditionalStatus1) {
        this.showData('RowingAdditionalStatus1:'+JSON.stringify(data));
    }
    protected onRowingAdditionalStatus2(data : ergometer.RowingAdditionalStatus2) {
        this.showData('RowingAdditionalStatus2:'+JSON.stringify(data));
    }
    protected onRowingStrokeData(data : ergometer.RowingStrokeData) {
        this.showData('RowingStrokeData:'+JSON.stringify(data));
    }
    protected onRowingAdditionalStrokeData(data : ergometer.RowingAdditionalStrokeData) {
        this.showData('RowingAdditionalStrokeData:'+JSON.stringify(data));
    }
    protected onRowingSplitIntervalData(data : ergometer.RowingSplitIntervalData) {
        this.showData('RowingSplitIntervalData:'+JSON.stringify(data));
    }
    protected onRowingAdditionalSplitIntervalData(data : ergometer.RowingAdditionalSplitIntervalData) {
        this.showData('RowingAdditionalSplitIntervalData:'+JSON.stringify(data));
    }
    //
    protected onWorkoutSummaryData(data : ergometer.WorkoutSummaryData) {
        this.showData('WorkoutSummaryData'+JSON.stringify(data));
    }
    protected onAdditionalWorkoutSummaryData(data : ergometer.AdditionalWorkoutSummaryData) {
        this.showData('AdditionalWorkoutSummaryData'+JSON.stringify(data));
    }
    protected onAdditionalWorkoutSummaryData2(data : ergometer.AdditionalWorkoutSummaryData2) {
        this.showData('AdditionalWorkoutSummaryData2:'+JSON.stringify(data));
    }

    protected onHeartRateBeltInformation(data : ergometer.HeartRateBeltInformation) {
        this.showData('HeartRateBeltInformation:'+JSON.stringify(data));
    }

    protected onConnectionStateChanged(oldState : ergometer.MonitorConnectionState, newState : ergometer.MonitorConnectionState) {

        if (newState==ergometer.MonitorConnectionState.readyForCommunication) {
            //this.performanceMonitor.sampleRate=SampleRate.rate250ms;
            this.showData(JSON.stringify( this._performanceMonitor.deviceInfo));

            //send two commands and show the results in a jquery way
            this.csafeTest();            
        }
    }
    protected csafeTest() {
        this.performanceMonitor.csafeBuffer
        .clear()
        .getStrokeState({
            onDataReceived: (strokeState : ergometer.StrokeState) =>{
                this.showData(`stroke state: ${strokeState}`);
            }
        })
        .getVersion({
            onDataReceived: (version : ergometer.csafe.IVersion)=> {
                this.showData(`Version hardware ${version.HardwareVersion} software:${version.FirmwareVersion}`);
            }
        })
        .setProgram({value:ergometer.Program.StandardList1})
        .send()
        .then(()=>{  //send returns a promise
            console.log("send done, you can send th next")
        }).catch(e=>{
            console.error(e);
        });
    }
    protected onPowerCurve(curve : number[]) {
        this.showData("Curve in gui: "+JSON.stringify(curve));
    }

    public pageLoaded() {
        var self=this;
        $('#devices').change( function ( ) {
            self.performanceMonitor.connectToDevice(this.value) ;
        });

        $('#devices').change( function () {
            self.performanceMonitor.connectToDevice(this.value) ;
        })
    }

    constructor() {
        this.initialize();


    }

    public startScan() {
        this.performanceMonitor.startScan((device : ergometer.DeviceInfo) => {
            //in web blue tooth the device selection is done by the user
            //just return true to to accept the user selection
            return true;
        });

    }
  

}
