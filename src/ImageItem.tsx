import React, {Component} from "react";
import Cropper from "react-easy-crop";
import {Area, MediaSize, Point} from "react-easy-crop/types";
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import {red} from '@mui/material/colors';
import {Cameraswitch, ContentCopy, BorderColor, Delete} from '@mui/icons-material';
import './image-item.css';
import {ICrop} from "./types";


interface ImageItemProps {
    image: string,
    crop?: Area,
    zoom?: number,
    index?: number,
    uid: string,
    onChange?: (crop: Area, zoom: number, uid: string) => any,
    onDeleteItem?: (uid: string) => any,
    size: any
}

interface ImageItemState {
    crop: Point,
    cropArea: Area,
    zoom: number,
    minZoom: number,
    aspect: number,
    mediaSize: MediaSize
}

class ImageItem extends Component<ImageItemProps, ImageItemState> {
    constructor(props: ImageItemProps) {
        super(props);
        this.state = {
            crop: {x: 0, y: 0},
            cropArea: {x: 0, y: 0, width: 100, height: 100},
            mediaSize: {width: 0, height: 0, naturalWidth: 0, naturalHeight: 0},
            zoom: this.props.zoom || 1,
            minZoom: 1,
            // aspect: 4.6 / 3
            aspect: (this.props.size[1] || 4.6) / (this.props.size[0] || 3)
        }
    }

    componentDidMount() {
        //console.log(this.state);
    }

    componentDidUpdate(prevProps: Readonly<ImageItemProps>, prevState: Readonly<ImageItemState>, snapshot?: any) {
        if (prevProps.size != this.props.size) {
            this.setState({
                aspect: (this.props.size[1] || 4.6) / (this.props.size[0] || 3)
            })
        }

        const aspect = (this.props.size[0] || 4.6) / (this.props.size[1] || 3);
        if (this.state.mediaSize.naturalHeight / this.state.mediaSize.naturalWidth >= 1 && prevState.aspect != aspect) {
            this.setState({
                aspect
            })
        }

    }

    private setCrop(crop: Point) {
        this.setState({
            crop: crop
        })
    }


    private onCropComplete(area: Area) {

    }

    private setZoom(zoom: any) {
        console.log(`Set zoom => ${zoom}`);
        this.setState({
            zoom: zoom
        });
        if (this.props.onChange) {
            this.props.onChange(this.state.cropArea, this.state.zoom, this.props.uid)
        }
    }

    private onMediaLoaded(mediaSize: MediaSize) {
        this.setState({
            //minZoom: mediaSize.naturalHeight / 180
        });
        this.setState({
            mediaSize: mediaSize
        })

    }

    private onDeleteItem() {
        if (this.props.onDeleteItem) {
            this.props.onDeleteItem(this.props.uid);
        }
    }

    render() {
        return (
            <div className={'image-root-container'}>
                <Card className={'image-toolbar'}>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            '& > *': {
                                m: 1,
                            },
                        }}
                    >
                        <ButtonGroup variant="text" size="small" aria-label="text button group">
                            <Button>
                                <Cameraswitch color="primary" fontSize="small"/>
                            </Button>
                            <Button>
                                <ContentCopy color="primary" fontSize="small"/>
                            </Button>
                            <Button>
                                <BorderColor color="primary" fontSize="small"/>
                            </Button>
                            <Button color="secondary" onClick={this.onDeleteItem.bind(this)}>
                                <Delete color="primary" fontSize="small" sx={{color: red[500]}}/>
                            </Button>
                            <Input defaultValue={1} type={'number'} inputProps={{'max': 4, min: 1}} size={'small'}
                                   className={'image-quantity-input'}/>
                        </ButtonGroup>
                    </Box>
                </Card>
                <div className={'image-card-container'}>
                    <div className={'zoom-slider-container'}>
                        <Slider
                            size="small"
                            defaultValue={0}
                            value={this.state.zoom}
                            step={0.1}
                            min={1}
                            max={5}
                            aria-label="Small"
                            valueLabelDisplay="off"
                            className={'zoom-slider'}
                            onChange={(e, value) => this.setZoom(value)}
                        />
                    </div>
                    <Cropper
                        classes={{
                            containerClassName: 'cropperContainer'
                        }}
                        rotation={0}
                        image={this.props.image}
                        crop={this.state.crop}
                        zoom={this.state.zoom}
                        aspect={this.state.aspect}
                        //aspect={3 / 4.6}
                        initialCroppedAreaPercentages={this.props.crop}
                        restrictPosition={true}
                        // cropSize={{width: 280, height: 180}}
                        zoomWithScroll={false}
                        minZoom={this.state.minZoom}
                        onCropChange={this.setCrop.bind(this)}
                        onCropComplete={this.onCropComplete.bind(this)}
                        onMediaLoaded={this.onMediaLoaded.bind(this)}
                    />
                </div>
            </div>

        )
    }

}

export default ImageItem;
