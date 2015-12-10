require.config({
    paths:{
        BB:    gomPath + 'bb/bb',
        CC:    gomPath + 'cc/cc'
    }
});

define('AA', ['BB', 'CC'], function(BB, CC){
    return {
        BB: BB,
        CC:CC
    };
});
