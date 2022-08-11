/* eslint-disable @next/next/no-img-element */
import { Component } from 'react'
import Head from '../../components/Head'
import Nav from '../../components/Nav'
import Loading from '../../components/Loading'

import { KalidokitController } from '../../helpers/KalidokitController'
import { withRouter, Router } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router'
import {createRef, useRef} from 'react'
import RecordRTC, {MediaStreamRecorder, MultiStreamRecorder, RecordRTCPromisesHandler, invokeSaveAsDialog} from 'recordrtc'

interface Props extends WithRouterProps {
    router: Router
}

interface ScreenRecorderState {
    // @ts-ignore
    stream: MediaStream | null
    blob: Blob | null
    isLoading: boolean
    progress: number 
    kalidokit: KalidokitController | null
}

class Home extends Component<Props, ScreenRecorderState> {

    refVideo = createRef<HTMLVideoElement>()
    refRecord : RecordRTC | null = null


    constructor(props: any) {
        super(props)
        this.state = {
            stream: null,
            blob: null,
            kalidokit: null,
            isLoading: true,
            progress: 0
        }
    }

    public async componentDidMount() {
        const input = document.getElementById("video-in")  as HTMLVideoElement;
        const kalidokit = new KalidokitController(
            input,
            `/${this.props.router.query.name}.vrm`,
            document.getElementById('canvas') as HTMLCanvasElement,
            sessionStorage.getItem("videoPath")!
        )
        await kalidokit.init((progress) => {
            this.setState({
                progress: Math.floor(100.0 * (progress.loaded / progress.total))
            })
        })
        this.setState({ 
            isLoading: false,
            kalidokit: kalidokit
        })
    }
    
    public handleStart() {
        const input = document.getElementById('animationCanvas') as HTMLCanvasElement;
        this.refRecord = new RecordRTC(input, {
            type: "canvas",
          });
        this.refRecord.startRecording()
        alert("recoding start!")
    }

    public handleSave() {
        this.refRecord?.stopRecording(() => {
            invokeSaveAsDialog(this.refRecord?.getBlob()!)
        })
    };

    public handleBackground() {
        let imgPathList = [
            "/bg/nike_bg.jpg",
            "/bg/bg2.jpg",
            "/bg/bg3.jpg",
            "/bg/bg4.jpg",
            "/bg/bg5.jpg",
            "/bg/bg6.jpg",
        ]

        //let index = Math.round(Math.random()*(imgPathList.length-1));
        this.state.kalidokit!.resetBackgroup(imgPathList[0]);
    };

    public handleProduct() {
        this.state.kalidokit!.loadProduct("/fzVfV1DPG.glb")
    };


    public handleProductMove() {
        this.state.kalidokit!.moveProduct()
    };

    public render() {
        return (
            <div className="main">
                <Head />
                <main>
                    <Nav />
                    {this.state.isLoading ? <Loading progress={this.state.progress ?? 0} /> : ''}
                    <div className="cursor-move flex absolute overflow-hidden rounded-lg transform scale-x-[-1] bottom-4 right-4">
                        <video
                            id="video-in"
                            className="h-auto max-w-xs bg-gray-100"
                            width="1280px"
                            height="720px"
                            ref={this.refVideo}
                        ></video>
                        <canvas id="canvas" className="block absolute bottom-0 left-0 h-auto w-full z-1"></canvas>
                    </div>
                    <div className="bg-red-400 h-16 w-full justify-center items-center flex flex-wrap">
                        <button 
                            onClick={this.handleStart.bind(this)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-3">
                            Start Recording
                        </button>
                        <button 
                            onClick={this.handleSave.bind(this)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-3">
                            Save Recording
                        </button>
                        <button 
                            onClick={this.handleBackground.bind(this)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-3">
                            Background
                        </button>
                        <button 
                            onClick={this.handleProduct.bind(this)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Product
                        </button>
                        <button 
                            onClick={this.handleProductMove.bind(this)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Move Product
                        </button>
                        <canvas id="animationCanvas"></canvas>
                    </div>
                </main>
            </div>
        )
    }
}

export default withRouter(Home)
