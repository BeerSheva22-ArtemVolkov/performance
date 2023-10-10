import workerpool from 'workerpool'

function totalThread(count) {
    const startTime = new Date();
    const partition = Math.trunc(count / 5)
    let total = 0;

    for (let i = 1; i < count; i++) {
        if (i % partition == 0) {
            const nPartition = i / partition
            // console.log(`${nPartition}. partition`);
            workerpool.workerEmit({ event: 'partition', data: `${nPartition}. partition` })
        }
        total++;
    }
    workerpool.workerEmit({ event: 'end', data: { api: 'node', total, time: new Date().getTime() - startTime.getTime() } });
}

//registration the thread functionality as any key and a functional object as a value
workerpool.worker({
    total: totalThread
})