export const searchList = [
    {
        name:'Отвертка',
        id: '9879435651288',
        type:'tools',
        property: ['gren', 'steel', 'cheap'],
        manufacturer:"Lao-Zi",
        price: 149
    },
    {
        name:'Молоток',
        id: '9879435651289',
        type:'tools',
        property: ['red', 'steel', 'cheap'],
        manufacturer:"Lao-Zi-Kai",
        price: 749
    },
    {
        name:'Хлеб',
        id: '700',
        type:'food',
        property: ['хлебобул.изд-я', 'нерез'],
        manufacturer:"Марфа Васильевна inc",
        price: 49
    },
    {
        name:'Левый поворотник для Nissan Sunny',
        id: '85468223515',
        type:'carTools',
        property: ['Левый', 'Nissan', 'cheap'],
        manufacturer:"Lao-Zi",
        price: 249
    },
    {
        name:'Шоколад',
        id:'458787',
        type:'food',
        property: ['Молочный', 'сладкий', 'вредный'],
        manufacturer:"Розовый Сентябрь",
        price: 69
    },
    {
        name:'Малый коммуникационный спутник',
        id: '8546844545223515',
        type:'космоприборы',
        property: ['Малый', 'космический', 'автоматический'],
        manufacturer:"Протосы",
        price: 24948948411548455554
    },
    {
        name:'Язь',
        id: '854687873515',
        type:'food',
        property: ['Свежий', 'вкусный', 'долгожданный'],
        manufacturer:"ОАО Балтика",
        price: 750
    },
];

export function getSearchString(itemObject){
    if(typeof(itemObject) === 'object') {
        return Object.values(itemObject).toString().toLowerCase()
    }
}
