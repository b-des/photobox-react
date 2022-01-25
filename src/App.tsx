import React, {Component} from 'react';
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";
import logo from './logo.svg';
import './App.css';
import {Pagination, Stack} from "@mui/material";
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Cropper from 'react-easy-crop'
import ImageItem from "./ImageItem";
import {uid} from 'react-uid';
import {ICrop} from './types';
import {Area} from "react-easy-crop/types";
import img from './images.json';
const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface IProps {
}

interface IState {
    currentPage: number,
    totalPages: number,
    itemsPerPage: number,
    images: any,
    personName: string
}

class App extends Component<IProps, IState> {
    tmpimages = img;
    images: any = [];
    names = [
        '9x13',
        '10x15',
        '13x18',
        '15x20',
        '9x9',
        '203x205',
        '15x15'
    ];

    constructor(props: IProps) {
        super(props);

        this.tmpimages.forEach(item => {
            this.images.push({
                url: item.url,

                uid: uid(item)
            })
        });
        this.state = {
            currentPage: 1,
            totalPages: this.images.length / 10,
            itemsPerPage: 10,
            images: this.images,
            personName: ''
        };
        console.log(this.images);
    }

    private onImageChanged(crop: Area, zoom: number, uid: string) {
        //console.log(crop);
        const newImages = [...this.state.images];
        newImages.filter(img => img.uid === uid).map(img => {
            img.crop = crop;
            img.zoom = zoom;
            return img;
        });

        /*    this.setState({
                images: newImages
            })*/
    }


    render() {
        return (
            <div className="App">
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiline
                        value={this.state.personName}
                        onChange={this.handleChange.bind(this)}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                    >
                        {this.names.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}


                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div className={'grid-layout'}>

                    {this.state.images.slice((this.state.currentPage - 1) * this.state.itemsPerPage, this.state.currentPage * this.state.itemsPerPage).map((img: any, i: number) => {
                        return <Card className={'grid-item'}>
                            {/*<TransformWrapper
                                initialScale={1}

                                alignmentAnimation={{
                                    disabled: false,
                                    velocityAlignmentTime: 0,
                                    animationTime: 0
                                }}
                                panning={{
                                    velocityDisabled: false
                                }}
                                onInit={(ref) => {
                                    setTimeout(() => {
                                        ref.centerView();
                                    }, 300);
                                }}
                                centerOnInit={true}
                                onPanningStop={(ref, e) => {
                                    //console.log(ref.instance.transformState);

                                    //console.log(ref.instance.contentComponent?.style.transform);
                                    //console.log(ref.instance.contentComponent?.clientWidth);

                                }}
                            >
                                {({zoomIn, zoomOut, resetTransform, ...rest}) => (
                                    <React.Fragment>
                                        <div className="tools">
                                            <button onClick={() => zoomIn()}>+</button>
                                            <button onClick={() => zoomOut()}>-</button>
                                            <button onClick={() => resetTransform()}>x</button>
                                            <button onClick={() => rest.centerView()}>center</button>
                                        </div>
                                        <TransformComponent
                                            wrapperClass={'cropper'}
                                        >
                                            <img src={img.url} alt={img.url} onLoad={() => rest.centerView()}/>
                                        </TransformComponent>
                                    </React.Fragment>
                                )}
                            </TransformWrapper>*/}
                            <ImageItem image={img.url} crop={img.crop} zoom={img.zoom}
                                       uid={img.uid}
                                       size={this.state.personName.split('x')}
                                //onChange={this.onImageChanged.bind(this)}
                                       key={img.uid}
                                       onDeleteItem={this.onDeleteItem.bind(this)}
                            />
                        </Card>
                    })}
                </div>
                <Pagination count={this.state.totalPages} color="primary"
                            onChange={this.onPaginationChanged.bind(this)}

                />

            </div>
        );
    }

    private handleChange(event: SelectChangeEvent) {
        const {
            target: {value},
        } = event;
        this.setState({
            personName: value
        });
    }

    private onPaginationChanged(target: React.ChangeEvent<unknown>, page: number) {
        this.setState({
            currentPage: page
        })
    }

    private onDeleteItem(uid: string) {
        console.log('onDeleteItem');
        const newImages = [...this.state.images];
        let i = newImages.filter(img => img.uid !== uid);

        this.setState({
            images: i
        })
    }


}

export default App;
