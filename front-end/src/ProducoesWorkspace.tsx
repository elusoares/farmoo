import {
    Boxes,
    CircleAlert,
    CircleCheck,
    HeartPulse,
    Layers3,
    LoaderCircle,
    PackageOpen,
    Plus,
    RefreshCw,
    Search,
    ShoppingCart,
    Warehouse,
    Wheat,
    X,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import {
    checkProducoesHealth,
    createProducao,
    getEstoqueProducoes,
    getProducoes,
    sellProducao,
} from './api'
import type { Animal, CreateProducaoPayload, EstoqueProducao, Producao } from './types'

type HealthStatus = 'checking' | 'online' | 'offline'
type ProductionView = 'producoes' | 'estoque'

type ProducoesWorkspaceProps = {
  animals: Animal[]
  onHealthChange: (health: HealthStatus) => void
}

const formatCurrency = (value: string | number | null) => {
  if (value === null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value),
  )
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = value.slice(0, 10).split('-')
  return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value
}

const formatQuantity = (value: string | number, unit: string) =>
  `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Number(value))} ${unit}`

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Não foi possível concluir a operação'

const ProducoesWorkspace = ({ animals, onHealthChange }: ProducoesWorkspaceProps) => {
  const [health, setHealth] = useState<HealthStatus>('checking')
  const [producoes, setProducoes] = useState<Producao[]>([])
  const [estoque, setEstoque] = useState<EstoqueProducao[]>([])
  const [view, setView] = useState<ProductionView>('producoes')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [sellTarget, setSellTarget] = useState<Producao | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const previousHealth = useRef<HealthStatus>('checking')
  const deferredSearch = useDeferredValue(search)

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const [productionData, stockData] = await Promise.all([
        getProducoes(),
        getEstoqueProducoes(),
      ])
      setProducoes(productionData)
      setEstoque(stockData)
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const verifyHealth = async () => {
    try {
      const healthy = await checkProducoesHealth()
      const wasOffline = previousHealth.current === 'offline'
      const status = healthy ? 'online' : 'offline'
      previousHealth.current = status
      setHealth(status)
      onHealthChange(status)
      if (healthy && wasOffline) await loadData(true)
    } catch {
      previousHealth.current = 'offline'
      setHealth('offline')
      onHealthChange('offline')
    }
  }

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const poll = async () => {
      try {
        const healthy = await checkProducoesHealth(controller.signal)
        if (!mounted) return
        const lastHealth = previousHealth.current
        const status = healthy ? 'online' : 'offline'
        previousHealth.current = status
        setHealth(status)
        onHealthChange(status)

        if (healthy && (lastHealth === 'checking' || lastHealth === 'offline')) {
          const [productionData, stockData] = await Promise.all([
            getProducoes(),
            getEstoqueProducoes(),
          ])
          if (mounted) {
            setProducoes(productionData)
            setEstoque(stockData)
          }
        }
      } catch {
        if (mounted) {
          previousHealth.current = 'offline'
          setHealth('offline')
          onHealthChange('offline')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void poll()
    const interval = window.setInterval(poll, 10_000)
    return () => {
      mounted = false
      controller.abort()
      window.clearInterval(interval)
    }
  }, [onHealthChange])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3_500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const term = deferredSearch.trim().toLocaleLowerCase('pt-BR')
  const filteredProducoes = producoes.filter((producao) =>
    !term ||
    `${producao.nome_animal} ${producao.tipo_animal} ${producao.tipo} ${producao.status}`
      .toLocaleLowerCase('pt-BR')
      .includes(term),
  )
  const soldProductions = producoes.filter((producao) => producao.vendido).length
  const availableProductions = producoes.length - soldProductions

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    const values = new FormData(event.currentTarget)
    const payload: CreateProducaoPayload = {
      animalId: Number(values.get('animalId')),
      tipo: String(values.get('tipo')),
      quantidade: Number(values.get('quantidade')),
      unidade: String(values.get('unidade')),
      data: String(values.get('data')),
    }

    try {
      await createProducao(payload)
      await loadData(true)
      setCreateOpen(false)
      setNotice('Produção registrada com sucesso')
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSell = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sellTarget) return
    setFormError(null)
    setIsSubmitting(true)
    const values = new FormData(event.currentTarget)

    try {
      await sellProducao(sellTarget.id, {
        valorVenda: Number(values.get('valorVenda')),
        dataVenda: String(values.get('dataVenda')),
      })
      await loadData(true)
      setSellTarget(null)
      setNotice(`Lote #${sellTarget.id} vendido com sucesso`)
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="workspace" aria-labelledby="productions-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Colheita e manejo</p>
          <h1 id="productions-title">Produção</h1>
        </div>
        <div className={`health-pill ${health}`}>
          {health === 'checking' ? <LoaderCircle className="spin" size={16} /> : health === 'online' ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
          {health === 'checking' ? 'Verificando' : health === 'online' ? 'Serviço online' : 'Serviço indisponível'}
        </div>
      </div>

      {health === 'offline' ? (
        <div className="service-unavailable">
          <div className="unavailable-icon"><HeartPulse size={30} /></div>
          <h2>Serviço de produção indisponível</h2>
          <p>Os dados de produção não podem ser acessados agora. O serviço de animais continua independente.</p>
          <button className="secondary-button" onClick={() => void verifyHealth()} type="button">
            <RefreshCw size={17} /> Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="summary-strip">
            <div className="metric"><span>Total de lotes</span><strong>{producoes.length}</strong></div>
            <div className="metric"><span>Em estoque</span><strong>{availableProductions}</strong></div>
            <div className="metric"><span>Vendidos</span><strong>{soldProductions}</strong></div>
            <div className="metric"><span>Produtos</span><strong>{estoque.length}</strong></div>
          </div>

          <div className="production-controls">
            <div className="segmented view-switch" aria-label="Visualização">
              <button className={view === 'producoes' ? 'selected' : ''} onClick={() => setView('producoes')} type="button"><Layers3 size={16} /> Produções</button>
              <button className={view === 'estoque' ? 'selected' : ''} onClick={() => setView('estoque')} type="button"><Warehouse size={16} /> Estoque</button>
            </div>
          </div>

          <div className="toolbar">
            {view === 'producoes' ? (
              <label className="search-field">
                <Search size={17} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por animal, produto ou status" />
              </label>
            ) : <div />}
            <div className="toolbar-actions">
              <button className="icon-button" onClick={() => void loadData(true)} title="Atualizar dados" type="button" disabled={isRefreshing}>
                <RefreshCw className={isRefreshing ? 'spin' : ''} size={18} />
              </button>
              <button className="primary-button" onClick={() => { setFormError(null); setCreateOpen(true) }} type="button">
                <Plus size={18} /> Nova produção
              </button>
            </div>
          </div>

          <div className="table-frame">
            {isLoading ? (
              <div className="table-state"><LoaderCircle className="spin" size={24} /> Carregando produções</div>
            ) : view === 'producoes' ? (
              filteredProducoes.length === 0 ? (
                <div className="table-state"><PackageOpen size={28} /><strong>Nenhuma produção encontrada</strong></div>
              ) : (
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>Produção</th><th>Animal</th><th>Data</th><th>Quantidade</th><th>Venda</th><th>Status</th><th aria-label="Ações" /></tr></thead>
                    <tbody>
                      {filteredProducoes.map((producao) => (
                        <tr key={producao.id}>
                          <td><div className="animal-cell"><span className="animal-icon"><Wheat size={19} /></span><span><strong className="capitalize">{producao.tipo}</strong><small>Lote #{producao.id}</small></span></div></td>
                          <td><strong>{producao.nome_animal}</strong><br /><small className="capitalize">{producao.tipo_animal} · #{producao.animal_id}</small></td>
                          <td>{formatDate(producao.data)}</td>
                          <td>{formatQuantity(producao.quantidade, producao.unidade)}</td>
                          <td>{formatCurrency(producao.valor_venda)}</td>
                          <td><span className={`status-tag ${producao.vendido ? 'vendido' : 'estoque'}`}>{producao.status}</span></td>
                          <td className="action-cell"><button className="sell-button" disabled={producao.vendido} onClick={() => { setFormError(null); setSellTarget(producao) }} type="button"><ShoppingCart size={16} /> {producao.vendido ? 'Vendido' : 'Vender'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : estoque.length === 0 ? (
              <div className="table-state"><Boxes size={28} /><strong>Estoque vazio</strong></div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead><tr><th>Produto</th><th>Unidade</th><th>Produzido</th><th>Vendido</th><th>Disponível</th></tr></thead>
                  <tbody>{estoque.map((item) => <tr key={`${item.produto}-${item.unidade}`}><td><strong className="capitalize">{item.produto}</strong></td><td className="capitalize">{item.unidade}</td><td>{formatQuantity(item.quantidade_produzida, item.unidade)}</td><td>{formatQuantity(item.quantidade_vendida, item.unidade)}</td><td><strong className="stock-value">{formatQuantity(item.quantidade_disponivel, item.unidade)}</strong></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {createOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false) }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="create-production-title">
            <div className="dialog-header"><div><p className="eyebrow">Registro</p><h2 id="create-production-title">Nova produção</h2></div><button className="icon-button" onClick={() => setCreateOpen(false)} title="Fechar" type="button"><X size={19} /></button></div>
            <form onSubmit={handleCreate}>
              <label><span>Animal</span><select name="animalId" required autoFocus><option value="">Selecione um animal</option>{animals.filter((animal) => !animal.vendido).map((animal) => <option key={animal.id} value={animal.id}>{animal.nome} · {animal.tipo} (#{animal.id})</option>)}</select></label>
              <div className="form-grid"><label><span>Produto</span><select name="tipo" required><option value="leite">Leite</option><option value="ovos">Ovos</option><option value="lã">Lã</option></select></label><label><span>Unidade</span><select name="unidade" required><option value="litros">Litros</option><option value="unidades">Unidades</option><option value="kg">Quilogramas</option></select></label></div>
              <div className="form-grid"><label><span>Quantidade</span><input name="quantidade" type="number" min="0.01" max="99999999.99" step="0.01" required /></label><label><span>Data da produção</span><input name="data" type="date" required /></label></div>
              {formError && <div className="form-error"><CircleAlert size={16} /> {formError}</div>}
              <div className="dialog-actions"><button className="secondary-button" onClick={() => setCreateOpen(false)} type="button">Cancelar</button><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting && <LoaderCircle className="spin" size={17} />} Registrar</button></div>
            </form>
          </section>
        </div>
      )}

      {sellTarget && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSellTarget(null) }}>
          <section className="dialog dialog-small" role="dialog" aria-modal="true" aria-labelledby="sell-production-title">
            <div className="dialog-header"><div><p className="eyebrow">Venda do lote</p><h2 id="sell-production-title">Vender {sellTarget.tipo}</h2></div><button className="icon-button" onClick={() => setSellTarget(null)} title="Fechar" type="button"><X size={19} /></button></div>
            <p className="dialog-context">Lote #{sellTarget.id} · {formatQuantity(sellTarget.quantidade, sellTarget.unidade)} · {sellTarget.nome_animal}</p>
            <form onSubmit={handleSell}>
              <label><span>Valor total da venda</span><div className="money-input"><span>R$</span><input name="valorVenda" type="number" min="0" max="99999999.99" step="0.01" required autoFocus /></div></label>
              <label><span>Data da venda</span><input name="dataVenda" type="date" min={sellTarget.data.slice(0, 10)} required /></label>
              {formError && <div className="form-error"><CircleAlert size={16} /> {formError}</div>}
              <div className="dialog-actions"><button className="secondary-button" onClick={() => setSellTarget(null)} type="button">Cancelar</button><button className="sale-action" disabled={isSubmitting} type="submit">{isSubmitting && <LoaderCircle className="spin" size={17} />} Confirmar venda</button></div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast"><CircleCheck size={18} /> {notice}</div>}
    </section>
  )
}

export default ProducoesWorkspace