'use client'
import { useEffect, useState } from 'react';
import { WebsocketClient, WSClientConfigurableOptions, RestClientV5 } from 'bybit-api';

export default function SubAccount({ API_KEY, PRIVATE_KEY }: any) {
	const [info, setInfo] = useState({
		symbol: '',
		leverage: '',
		size: '',
		entryPrice: '',
		markPrice: '',
		liqPrice: '',
		unrealisedPnl: ''
	})
	const [error, setError] = useState('')

	useEffect(() => {
		const getInfo = () => {
			const restClient = new RestClientV5({
				key: API_KEY,
				secret: PRIVATE_KEY,
			});

			restClient.getPositionInfo({ category: 'linear', symbol: 'ATOMUSDT' })
			.then(result => {
				console.log("getPositionInfo result: ", result);
				if (result.result.list) {
					const payload: any = result.result.list[0];
					setInfo({
						symbol: payload.symbol,
						leverage: payload.leverage,
						size: payload.size,
						entryPrice: payload.bustPrice,
						markPrice: payload.markPrice,
						liqPrice: payload.liqPrice,
						unrealisedPnl: payload.unrealisedPnl
					})
					setError('')
				}
				else {
					setError(result.retMsg)
				}
			})
			.catch(err => {
				console.error("getPositionInfo error: ", err);
			});
		}

		getInfo();

		const wsConfig: WSClientConfigurableOptions = {
			key: API_KEY,
			secret: PRIVATE_KEY,
			market: 'v5'
		};

		const ws = new WebsocketClient(wsConfig);

		ws.subscribeV5(['position'], 'linear');

		ws.on('update', data => {
			console.log('update', data);
			const payload = data.data[0];
			setInfo({
				symbol: payload.symbol,
				leverage: payload.leverage,
				size: payload.size,
				entryPrice: payload.entryPrice,
				markPrice: payload.markPrice,
				liqPrice: payload.liqPrice,
				unrealisedPnl: payload.unrealisedPnl
			})
		});
		
		// Optional: Listen to websocket connection open event (automatic after subscribing to one or more topics)
		ws.on('open', ({ wsKey, event }) => {
			console.log('connection open for websocket with ID: ' + wsKey);
			// ws.tryWsSend(wsKey, 'ping')
		});
		
		// Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
		ws.on('response', response => {
			console.log('response', response);
		});
		
		// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
		ws.on('close', () => {
			console.log('connection closed');
		});
		
		// Optional: Listen to raw error events.
		// Note: responses to invalid topics are currently only sent in the "response" event.
		ws.on('error', err => {
			console.error('ERR', err);
		});

		return 
	}, [])

	return error?<>{error}</>: (<div className='flex-col items-center justify-between w-full py-6 h-64'>
		<div className="md:flex justify-between w-full py-5">
			<div>
				<div className="relative flex place-items-center">
					<span className='text-2xl mx-2'>{info.symbol}</span> 
					<span className='text-green-300 bg-emerald-900 rounded-sm opacity-75'>Long</span>
				</div>
				<div className="relative flex place-items-center mx-2">
					Cross {Number(info.leverage).toFixed(2)}x
				</div>
			</div>
			<div>
				<div className="text-lg relative flex place-items-center opacity-70 mx-2">
					Unrealized P&L
				</div>
				<div className="text-2xl relative text-right mx-2 text-red-400	text-right">
					{Number(info.unrealisedPnl).toFixed(2)}
				</div>
			</div>
		</div>
		<div className="md:flex justify-between w-full">
			<div>
				<div className="text-lg relative flex place-items-center opacity-70 mx-2">
					Position Size
				</div>
				<div className="text-2xl relative flex place-items-center mx-2 ">
					{Number(info.size).toFixed(2)}
				</div>
			</div>
			<div>
				<div className="text-lg relative flex place-items-center opacity-70 mx-2">
					Entry Price
				</div>
				<div className="text-2xl relative flex place-items-center mx-2 ">
					{Number(info.entryPrice).toFixed(2)}
				</div>
			</div>
			<div>
				<div className="text-lg relative flex place-items-center opacity-70 mx-2">
					Mark Price
				</div>
				<div className="text-2xl relative flex place-items-center mx-2 ">
					{Number(info.markPrice).toFixed(2)}
				</div>
			</div>
			<div>
				<div className="text-lg relative flex place-items-center opacity-70 mx-2">
					Estimated Liq. Price
				</div>
				<div className="text-2xl relative text-right mx-2 text-amber-400">
					{Number(info.liqPrice).toFixed(2)}
				</div>
			</div>
		</div>
	</div>)
}