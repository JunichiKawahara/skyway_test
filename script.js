'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

/* カメラ映像、マイク音声の取得 */
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

/* Peerオブジェクトの作成 */
peer = new Peer({
    key: 'fa2088ab-25bd-45d9-9aca-2a5ba28b03c3',
    debug: 3
});

peer.on('open', function() {
    $('#my-id').text(peer.id);
});

peer.on('error', function(err) {
    alert(err.message);
});

peer.on('close', function() {

});

peer.on('isconnected', function() {

});

/* 発信処理 */
$('#make-call').submit(function(e) {
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

/* 切断処理 */
$('#end-call').click(function() {
    existingCall.close();
});

/* 着信処理 */
peer.on('call', function(call) {
    call.answer(localStream);
    setupCallEventHandlers(call);
})

function setupCallEventHandlers(call) {
    if (existingCall) {
        existingCall.close();
    }

    existingCall = call;

    call.on('stream', function(stream) {
        addVideo(call, stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });

    call.on('close', function() {
        removeVideo(call.remoteId);
        setupMakeCallUI();
    })
}

/* video要素の再生 */
function addVideo(call, stream) {
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId) {
    $('#their-video').get(0).srcObject = undefined;
}

function setupMakeCallUI() {
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
