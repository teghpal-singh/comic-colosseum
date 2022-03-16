import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

const GET_LOGO = gql`
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            username
            canvasWidth
            canvasHeight
            xpos
            ypos
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderRadius
            borderWidth
            padding
            margin
        }
    }
`;

const UPDATE_LOGO = gql`
    mutation updateLogo(
        $id: String!,
        $username: String!,
        $canvasWidth: Int!,
        $canvasHeight:Int!,
        $xpos:[Int!],
        $ypos:[Int!],
        $text: [String!],
        $color: [String!],
        $fontSize: [Int!],
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderWidth: Int!,
        $padding: Int!,
        $margin: Int!) {
            updateLogo(
                id: $id,
                username: $username,
                canvasWidth: $canvasWidth,
                canvasHeight: $canvasHeight,
                xpos: $xpos,
                ypos: $ypos,
                text: $text,
                color: $color,
                fontSize: $fontSize,
                backgroundColor: $backgroundColor,
                borderColor: $borderColor,
                borderRadius: $borderRadius,
                borderWidth: $borderWidth,
                padding: $padding,
                margin: $margin
                ) {
                    lastUpdate
                }
        }
`;

const DELETE_LOGO = gql`
  mutation removeLogo($id: String!) {
    removeLogo(id:$id) {
      _id
    }
  }
`;

var selected = null;
var lastSelected;
var ctx;
var dragOffsetX;
var dragOffsetY;
var tempColor;
var images = [];
var canvasWidth, canvasHeight,xpos=[],ypos=[], text = [], color= [], fontSize= [], backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;


class EditLogoScreen extends Component {
    constructor(){
        super();
        this.state={
                text: null,
                color : null,
                fontSize : null,
                backgroundColor : null,
                borderColor : null,
                borderRadius : null,
                borderWidth : null,
                padding : null,
                margin : null
            }
    }

    exportLogo=()=>{
        document.getElementById('btn-download').href = document.getElementById('canvas').toDataURL('image/png');
    }

    moveUp=()=>{
    if(lastSelected !== null && text[lastSelected+1] !== undefined)
        this.reorderText(1)
    }
    moveDown=()=>{
    if(lastSelected !== null && text[lastSelected-1] !== undefined)
        this.reorderText(-1)
    }
    remove=()=>{
        if(lastSelected !== null && text[lastSelected] !== undefined){
            for(let i = lastSelected; i < text.length; i++){
                if(text[i+1] !== undefined){
                xpos[i] = xpos[i+1]
                ypos[i] = ypos[i+1]
                text[i] = text[i+1]
                color[i] = color[i+1]
                fontSize[i] = fontSize[i+1]
                images[i] = images[i+1];
                }else{
                    if(color[i] === 'image')
                    xpos.length -= 1;
                    ypos.length -= 1;
                    text.length -= 1
                    color.length -= 1;
                    fontSize.length -= 1;
                    images.length -= 1;
                    lastSelected = null;
                }
            }
            lastSelected = null;
            document.getElementById('selectedLabel').innerHTML = "Selected: "
            setTimeout(this.renderCanvas,100);
        }
    }

    reorderText=(num)=>{
            let tempX = xpos[lastSelected];
            let tempY = ypos[lastSelected];
            let tempText = text[lastSelected];
            let tempColor = color[lastSelected];
            let tempFont = fontSize[lastSelected];
            let tempImg = images[lastSelected];
            xpos[lastSelected] = xpos[lastSelected+num]
            xpos[lastSelected+num] = tempX
            ypos[lastSelected] = ypos[lastSelected+num]
            ypos[lastSelected+num] = tempY
            text[lastSelected] = text[lastSelected+num]
            text[lastSelected+num] = tempText
            color[lastSelected] = color[lastSelected+num]
            color[lastSelected+num] = tempColor
            fontSize[lastSelected] = fontSize[lastSelected+num]
            fontSize[lastSelected+num] = tempFont
            images[lastSelected] = images[lastSelected+num];
            images[lastSelected+num] = tempImg;
            lastSelected = lastSelected + num;
            setTimeout(this.renderCanvas,100);
    }

    addText=()=>{
        let i = text.length;
        text[i] = document.getElementById('newText').value;
        color[i] = document.getElementById('newColor').value;
        fontSize[i] = parseInt(document.getElementById('newFont').value);
        xpos[i] = 10;
        ypos[i] = 10;
        lastSelected = i;
        document.getElementById('selectedLabel').innerHTML = "Selected: " + text[lastSelected];
        setTimeout(this.renderCanvas,100);
    }

    updateText=()=>{
        if(lastSelected !== null){
        text[lastSelected] = document.getElementById('newText').value;
        color[lastSelected] = document.getElementById('newColor').value;
        fontSize[lastSelected] = parseInt(document.getElementById('newFont').value);
        this.renderCanvas();
        }
    }

    validateImage=()=>{
        let tempimg = new Image();
        tempimg.src = document.getElementById('imageTextBox').value;
        tempimg.onload = this.addImage
    }

    addImage=()=>{
            let i = text.length;
            text[i] = document.getElementById('imageTextBox').value;
            color[i] = "image"
            let fontString = document.getElementById('imageScaleBox').value;
            if(fontString.substring(0,1) === '.' ){
                fontSize[i] = parseInt(fontString.substring(1,2));
            }else if(fontString.substring(0,1) === '0' && fontString.substring(1,2) === '.'){
                fontSize[i] = parseInt(fontString.substring(2,3));
            }else{
                fontSize[i] = parseInt(fontString)*10;
            }
            xpos[i] = 10;
            ypos[i] = 10;
            lastSelected = i;
            document.getElementById('selectedLabel').innerHTML = "Selected: Image";
            images[i] = new Image();
            images[i].crossOrigin = 'anonymous';
            images[i].src = text[i];
            setTimeout(this.renderCanvas,100);
    }

    updateImage=()=>{
        if(lastSelected !== null && color[lastSelected] === 'image'){
            text[lastSelected] = document.getElementById('imageTextBox').value;
            let fontString = document.getElementById('imageScaleBox').value;
            if(fontString.substring(0,1) === '.' ){
                fontSize[lastSelected] = parseInt(fontString.substring(1,2));
            }else if(fontString.substring(0,1) === '0' && fontString.substring(1,2) === '.'){
                fontSize[lastSelected] = parseInt(fontString.substring(2,3));
            }else{
                fontSize[lastSelected] = parseInt(fontString)*10;
            }
            setTimeout(this.renderCanvas,100);
        }
    }    

    updateCanvas=()=>{
            canvasWidth = parseInt(document.getElementById('canvasWidth').value);
            canvasHeight = parseInt(document.getElementById('canvasHeight').value);
            let canvas = document.getElementById('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            backgroundColor = document.getElementById('backgroundColor').value;
            borderColor = document.getElementById('borderColor').value;
            borderRadius = parseInt(document.getElementById('borderRadius').value);
            borderWidth = parseInt(document.getElementById('borderWidth').value);
            padding = parseInt(document.getElementById('padding').value);
            margin = parseInt(document.getElementById('margin').value);
            setTimeout(this.renderCanvas,100);
    }

    getMousePos(e) {
        var r = document.getElementById('canvas').getBoundingClientRect();
        return {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };
    }

    handlemousedown = (e) =>{  
        var mouse = this.getMousePos(e);
        for(let i = 0; i < text.length; i++){
            if(color[i] !== 'image'){
                ctx.font = fontSize[i] + "pt Arial";
                let width = ctx.measureText(text[i]).width;
                if (mouse.x >= xpos[i] && mouse.x <= xpos[i] + width &&
                mouse.y >= ypos[i] && mouse.y <= ypos[i] + fontSize[i]) {
                    selected = i;
                    lastSelected = selected;
                    document.getElementById('selectedLabel').innerHTML = "Selected: " + text[lastSelected];
                    dragOffsetX = xpos[selected] - mouse.x;
                    dragOffsetY = ypos[selected] - mouse.y;
                    document.getElementById('newText').value = text[selected];
                    document.getElementById('newColor').value = color[selected];
                    document.getElementById('newFont').value = fontSize[selected];
                }
            }else{
                if(mouse.x >= xpos[i] && mouse.x <= xpos[i] + images[i].naturalWidth*fontSize[i]/10&&
                    mouse.y >= ypos[i] && mouse.y <= ypos[i] + images[i].naturalHeight*fontSize[i]/10){
                        selected = i;
                        lastSelected = selected;
                        document.getElementById('selectedLabel').innerHTML = "Selected: Image";
                        dragOffsetX = xpos[selected] - mouse.x;
                        dragOffsetY = ypos[selected] - mouse.y;
                        document.getElementById('imageTextBox').value = text[selected];
                        document.getElementById('imageScaleBox').value = fontSize[selected]/10;
                }
             }
        }
    }

    handlemousemove= (e) =>{
        if(selected !== null){
            var mouse = this.getMousePos(e);
                xpos[selected]= mouse.x + dragOffsetX;
                ypos[selected]= mouse.y + dragOffsetY;
                this.renderCanvas();
            }
        }
    

    handlemouseup = (e) =>{
        selected = null;}

    componentDidUpdate = () => {
        canvasWidth = this.state.canvasWidth;
        canvasHeight = this.state.canvasHeight
        backgroundColor = this.state.backgroundColor
        borderColor = this.state.borderColor
        borderRadius = this.state.borderRadius
        borderWidth = this.state.borderWidth
        padding = this.state.padding
        margin = this.state.margin
        for(let i = 0; i < this.state.text.length; i++){
            text[i] = this.state.text[i];
            color[i] = this.state.color[i];
            fontSize[i] = this.state.fontSize[i];
            xpos[i] = this.state.xpos[i];
            ypos[i] = this.state.ypos[i];
            if(color[i] === 'image'){
                images[i] = new Image();
                images[i].crossOrigin = 'anonymous';
                images[i].src = text[i];
            }
        }
        var canvas = document.getElementById('canvas');
        canvas.addEventListener('mousedown', this.handlemousedown, false);
        canvas.addEventListener('mousemove', this.handlemousemove, false);
        canvas.addEventListener('mouseup', this.handlemouseup, false);
        ctx = canvas.getContext('2d');
        this.updateCanvas();
        this.renderCanvas();
    }

    renderCanvas=()=>{
        ctx.textBaseline = "top";
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.beginPath(); 
        ctx.moveTo(0 + borderRadius, 0);
        ctx.lineTo(0 + canvasWidth - borderRadius, 0);
        ctx.quadraticCurveTo(0 + canvasWidth, 0, 0 + canvasWidth, 0 + borderRadius);
        ctx.lineTo(0 + canvasWidth, 0 + canvasHeight - borderRadius);
        ctx.quadraticCurveTo(0 + canvasWidth, 0 + canvasHeight, 0 + canvasWidth - borderRadius, 0 + canvasHeight);
        ctx.lineTo(0 + borderRadius, 0 + canvasHeight);
        ctx.quadraticCurveTo(0, 0 + canvasHeight, 0, 0 + canvasHeight - borderRadius);
        ctx.lineTo(0, 0 + borderRadius);
        ctx.quadraticCurveTo(0, 0, 0 + borderRadius, 0);
        ctx.stroke();
        ctx.moveTo(0,0);
        //background/texts
        ctx.lineWidth= 1;
        for(let i = 0; i < text.length; i++){
            if(color[i] !== "image"){
                ctx.font = fontSize[i] + "pt Arial";
                let width = ctx.measureText(text[i]).width;
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(xpos[i]+margin-(padding/2), ypos[i]+margin-(padding/2),width+padding,fontSize[i]*1.4+padding);
                ctx.fillStyle = color[i];
                ctx.fillText(text[i],xpos[i],ypos[i]);
            }else{
                ctx.drawImage(images[i],xpos[i],ypos[i],images[i].naturalWidth*(fontSize[i]/10),images[i].naturalHeight*(fontSize[i]/10));
            }
        }
    }

    changeTempColor=(e)=>{
        tempColor = e.target.value;
    }

    render() {
        return (
            <Query query={GET_LOGO} variables={{ logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    if(this.state.text === null){
                        this.setState({
                            canvasWidth: data.logo.canvasWidth,
                            canvasHeight: data.logo.canvasHeight,
                            xpos: data.logo.xpos,
                            ypos: data.logo.ypos,
                            text: data.logo.text,
                            color : data.logo.color,
                            fontSize : data.logo.fontSize,
                            backgroundColor : data.logo.backgroundColor,
                            borderColor : data.logo.borderColor,
                            borderRadius : data.logo.borderRadius,
                            borderWidth : data.logo.borderWidth,
                            padding : data.logo.padding,
                            margin : data.logo.margin
                        })
                    }
                    return (
                        <Mutation mutation={UPDATE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push(`/home`)}>
                            {(updateLogo, { loading, error }) => (
                                <div className="container">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h4><Link to="/home">Home</Link></h4>
                                            <h3 className="panel-title">
                                                Edit Logo
                                        </h3>
                                        </div>
                                    </div>
                                        <div className="row">
                                        <div className="panel-body">    
                                        <a onClick={this.exportLogo} href="#" class="button" id="btn-download" download="my-file-name.png">Export Logo</a>                                        
                                        <br/>
                                        <b><label id="selectedLabel" htmlFor="text">{"Selected:"}</label></b>
                                        <br/>
                                        <button onClick={this.moveUp}>Move Up</button>
                                        <button onClick={this.moveDown}>Move Down</button>
                                        <button onClick={this.remove}>Remove</button>
                                        <div className="form-group">
                                            <label htmlFor="text">Text:</label>
                                            <input id="newText" type="text" className="form-control" name="text" placeholder="Text" defaultValue={"GoLogoLo"}/>
                                            <label htmlFor="text">Color:</label>
                                            <input type="color" id="newColor" className="form-control" ref={node => {
                                                tempColor = node;}} onChange={this.changeTempColor} placeholder="Background Color" defaultValue={"#ff0000"}/>
                                            <label htmlFor="text">Font Size:</label>
                                            <input id="newFont" type="text" className="form-control" name="text" placeholder="Font Size" defaultValue={50}/>
                                        <button onClick={this.addText}>Add Text</button>
                                        <button onClick={this.updateText}>Update Text</button>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="text">Image Url:</label>
                                            <input id="imageTextBox" type="text" className="form-control" name="text" placeholder="Image Url"/>
                                            <label htmlFor="text">Image Scale:</label>
                                            <input id="imageScaleBox" type="text" className="form-control" name="text" placeholder="Image Scale" defaultValue={1}/>
                                        <button onClick={this.validateImage}>Add Image</button>
                                        <button onClick={this.updateImage}>Update Image</button>
                                        <br/>
                                        <br/>
                                        <label>If images do not appear, Update Canvas</label>
                                        <br/>
                                        <button onClick={this.updateCanvas}>Update Canvas</button>
                                            </div>
                                            <form onSubmit={e => {
                                                e.preventDefault();
                                                this.updateCanvas();
                                                updateLogo({ variables: { id: data.logo._id, username:data.logo.username, canvasWidth:canvasWidth,canvasHeight:canvasHeight, 
                                                xpos: xpos, ypos:ypos, text:text, color: color, fontSize: fontSize,
                                                backgroundColor: backgroundColor, borderColor: borderColor, borderRadius: borderRadius,
                                                borderWidth: borderWidth, padding: padding, margin: margin } });
                                            }}>
                                                <div className="form-group">
                                                    <label htmlFor="text">Canvas Width:</label>
                                                    <input id="canvasWidth" type="text" className="form-control" name="text" ref={node => {
                                                        canvasWidth = node;
                                                    }} placeholder="Canvas Width" defaultValue={data.logo.canvasWidth} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="text">Canvas Height:</label>
                                                    <input id="canvasHeight" type="text" className="form-control" name="text" ref={node => {
                                                        canvasHeight = node;
                                                    }} placeholder="Canvas Height" defaultValue={data.logo.canvasHeight} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="backgroundColor">Background Color:</label>
                                                    <input id="backgroundColor" type="color" className="form-control" name="backgroundColor" ref={node => {
                                                        backgroundColor = node;
                                                    }} placeholder="Background Color" defaultValue={data.logo.backgroundColor} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderColor">Border Color:</label>
                                                    <input id="borderColor" type="color" className="form-control" name="borderColor" ref={node => {
                                                        borderColor = node;
                                                    }} placeholder="Border Color" defaultValue={data.logo.borderColor} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderRadius">Border Radius:</label>
                                                    <input id="borderRadius" type="text" className="form-control" name="borderRadius" ref={node => {
                                                        borderRadius = node;
                                                    }} placeholder="Border Radius" defaultValue={data.logo.borderRadius} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderWidth">Border Width:</label>
                                                    <input id="borderWidth" type="text" className="form-control" name="borderWidth" ref={node => {
                                                        borderWidth = node;
                                                    }} placeholder="Border Width" defaultValue={data.logo.borderWidth} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="padding">Padding:</label>
                                                    <input id="padding" type="text" className="form-control" name="padding" ref={node => {
                                                        padding = node;
                                                    }} placeholder="Padding" defaultValue={data.logo.padding} />
                                                </div>
                                                <div className="form-group">
                                                <label htmlFor="Margin">Margin:</label>
                                                    <input id="margin" type="text" className="form-control" name="margin" ref={node => {
                                                        margin = node;
                                                    }} placeholder="Margin" defaultValue={data.logo.margin} />
                                                </div>
                                                <div className ="row">
                                                <button type="submit" className="btn btn-success">Submit</button>
                                                <Mutation mutation={DELETE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push('/home')}>
                                                {(removeLogo, { loading, error }) => (
                                                    <div>
                                                    <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        removeLogo({ variables: { id: data.logo._id } });
                                                    }}>
                                                    <button type="submit" className="btn btn-danger">Delete Logo </button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                    </div>
                                                    )}
                                                </Mutation>
                                                </div>
                                            </form>
                                            {loading && <p>Loading...</p>}
                                            {error && <p>Error :( Please try again</p>}
                                        </div>
                                        <div className="col s8" style = {{overflow: "auto"}}>
                                        <canvas id="canvas" width={data.logo.canvasWidth} height={data.logo.canvasHeight} style={{border:"1px solid black"}}/>                                        
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default EditLogoScreen;