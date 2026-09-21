import {
    BadgeDollarSign,
    CircleAlert,
    CircleCheck,
    HeartPulse,
    LoaderCircle,
    PackageOpen,
    Plus,
    ReceiptText,
    RefreshCw,
    Scale,
    Search,
    ShoppingBag,
    TrendingDown,
    TrendingUp,
    X,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import {
    checkFinanceiroHealth,
    createCusto,
    getCustos,
    getResultado,
    getVendas,
} from './api'
import type { Animal, CreateCustoPayload, Custo, ResultadoPorAnimal, Venda } from './types'

type HealthStatus = 'checking' | 'online' | 'offline'
type FinancialView = 'custos' | 'vendas' | 'resultado'
type CostScope = 'geral' | 'especifico'

type FinanceiroWorkspaceProps = {
  animals: Animal[]
  onHealthChange: (health: HealthStatus) => void
}

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))

const formatDate = (value: string) => {
  const date = value.slice(0, 10).split('-')
  return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value
}

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Não foi possível concluir a operação'

const FinanceiroWorkspace = ({ animals, onHealthChange }: FinanceiroWorkspaceProps) => {
  const [health, setHealth] = useState<HealthStatus>('checking')
  const [custos, setCustos] = useState<Custo[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [resultados, setResultados] = useState<ResultadoPorAnimal[]>([])
  const [view, setView] = useState<FinancialView>('custos')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [costScope, setCostScope] = useState<CostScope>('geral')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const previousHealth = useRef<HealthStatus>('checking')
  const deferredSearch = useDeferredValue(search)

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const [costData, salesData, resultData] = await Promise.all([
        getCustos(),
        getVendas(),
        getResultado(),
      ])
      setCustos(costData)
      setVendas(salesData)
      setResultados(resultData)
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const verifyHealth = async () => {
    try {
      const healthy = await checkFinanceiroHealth()
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
        const healthy = await checkFinanceiroHealth(controller.signal)
        if (!mounted) return
        const lastHealth = previousHealth.current
        const status = healthy ? 'online' : 'offline'
        previousHealth.current = status
        setHealth(status)
        onHealthChange(status)

        if (healthy && (lastHealth === 'checking' || lastHealth === 'offline')) {
          const [costData, salesData, resultData] = await Promise.all([
            getCustos(),
            getVendas(),
            getResultado(),
          ])
          if (mounted) {
            setCustos(costData)
            setVendas(salesData)
            setResultados(resultData)
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
  const filteredCustos = custos.filter((custo) =>
    !term || `${custo.tipo} ${custo.descricao ?? ''} ${custo.nome_animal ?? 'geral'}`
      .toLocaleLowerCase('pt-BR')
      .includes(term),
  )
  const filteredVendas = vendas.filter((venda) =>
    !term || `${venda.produto} ${venda.id}`.toLocaleLowerCase('pt-BR').includes(term),
  )
  const filteredResultados = resultados.filter((resultado) =>
    !term || `${resultado.nome_animal} ${resultado.tipo_animal} ${resultado.situacao}`
      .toLocaleLowerCase('pt-BR')
      .includes(term),
  )

  const totalCustos = custos.reduce((total, custo) => total + Number(custo.valor), 0)
  const totalVendas = vendas.reduce((total, venda) => total + Number(venda.valor_total), 0)
  const resultadoAnimais = resultados.reduce(
    (total, resultado) => total + Number(resultado.resultado),
    0,
  )
  const animalsWithLoss = resultados.filter((resultado) => resultado.situacao === 'prejuizo').length

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    const values = new FormData(event.currentTarget)
    const description = String(values.get('descricao')).trim()
    const payload: CreateCustoPayload = {
      tipo: String(values.get('tipo')),
      ...(description ? { descricao: description } : {}),
      valor: Number(values.get('valor')),
      data: String(values.get('data')),
      ...(costScope === 'especifico' ? { animalId: Number(values.get('animalId')) } : {}),
    }

    try {
      await createCusto(payload)
      await loadData(true)
      setCreateOpen(false)
      setCostScope('geral')
      setNotice('Custo registrado com sucesso')
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const searchPlaceholder =
    view === 'custos'
      ? 'Buscar por tipo, descrição ou animal'
      : view === 'vendas'
        ? 'Buscar por produto ou lote'
        : 'Buscar por animal, tipo ou situação'

  return (
    <section className="workspace" aria-labelledby="financial-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Contas da propriedade</p>
          <h1 id="financial-title">Financeiro</h1>
        </div>
        <div className={`health-pill ${health}`}>
          {health === 'checking' ? <LoaderCircle className="spin" size={16} /> : health === 'online' ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
          {health === 'checking' ? 'Verificando' : health === 'online' ? 'Serviço online' : 'Serviço indisponível'}
        </div>
      </div>

      {health === 'offline' ? (
        <div className="service-unavailable">
          <div className="unavailable-icon"><HeartPulse size={30} /></div>
          <h2>Serviço financeiro indisponível</h2>
          <p>Custos, vendas e resultados não podem ser acessados agora. Os demais serviços continuam independentes.</p>
          <button className="secondary-button" onClick={() => void verifyHealth()} type="button">
            <RefreshCw size={17} /> Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="summary-strip financial-summary">
            <div className="metric"><span>Custos registrados</span><strong>{formatCurrency(totalCustos)}</strong></div>
            <div className="metric"><span>Vendas de produção</span><strong>{formatCurrency(totalVendas)}</strong></div>
            <div className={`metric financial-result ${resultadoAnimais < 0 ? 'negative' : 'positive'}`}><span>Resultado dos animais</span><strong>{formatCurrency(resultadoAnimais)}</strong></div>
            <div className="metric"><span>Animais com prejuízo</span><strong>{animalsWithLoss}</strong></div>
          </div>

          <div className="production-controls">
            <div className="segmented financial-view-switch" aria-label="Visualização financeira">
              <button className={view === 'custos' ? 'selected' : ''} onClick={() => setView('custos')} type="button"><ReceiptText size={16} /> Custos</button>
              <button className={view === 'vendas' ? 'selected' : ''} onClick={() => setView('vendas')} type="button"><ShoppingBag size={16} /> Vendas</button>
              <button className={view === 'resultado' ? 'selected' : ''} onClick={() => setView('resultado')} type="button"><Scale size={16} /> Resultado</button>
            </div>
          </div>

          <div className="toolbar">
            <label className="search-field">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} />
            </label>
            <div className="toolbar-actions">
              <button className="icon-button" onClick={() => void loadData(true)} title="Atualizar dados" type="button" disabled={isRefreshing}>
                <RefreshCw className={isRefreshing ? 'spin' : ''} size={18} />
              </button>
              <button className="primary-button" onClick={() => { setFormError(null); setCreateOpen(true) }} type="button">
                <Plus size={18} /> Novo custo
              </button>
            </div>
          </div>

          <div className="table-frame">
            {isLoading ? (
              <div className="table-state"><LoaderCircle className="spin" size={24} /> Carregando dados financeiros</div>
            ) : view === 'custos' ? (
              filteredCustos.length === 0 ? (
                <div className="table-state"><PackageOpen size={28} /><strong>Nenhum custo encontrado</strong></div>
              ) : (
                <div className="table-scroll"><table><thead><tr><th>Custo</th><th>Escopo</th><th>Data</th><th>Valor</th></tr></thead><tbody>{filteredCustos.map((custo) => <tr key={custo.id}><td><div className="animal-cell"><span className="animal-icon cost-icon"><ReceiptText size={19} /></span><span><strong className="capitalize">{custo.tipo}</strong><small>#{custo.id} · {custo.descricao ?? 'Sem descrição'}</small></span></div></td><td>{custo.animal_id ? <><strong>{custo.nome_animal}</strong><br /><small>Animal #{custo.animal_id}</small></> : <span className="status-tag geral">Geral</span>}</td><td>{formatDate(custo.data)}</td><td><strong>{formatCurrency(custo.valor)}</strong></td></tr>)}</tbody></table></div>
              )
            ) : view === 'vendas' ? (
              filteredVendas.length === 0 ? (
                <div className="table-state"><PackageOpen size={28} /><strong>Nenhuma venda encontrada</strong></div>
              ) : (
                <div className="table-scroll"><table><thead><tr><th>Produto</th><th>Data</th><th>Quantidade</th><th>Preço unitário</th><th>Valor total</th></tr></thead><tbody>{filteredVendas.map((venda) => <tr key={venda.id}><td><div className="animal-cell"><span className="animal-icon sale-icon"><BadgeDollarSign size={19} /></span><span><strong className="capitalize">{venda.produto}</strong><small>Lote #{venda.id}</small></span></div></td><td>{formatDate(venda.data)}</td><td>{new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Number(venda.quantidade))}</td><td>{formatCurrency(venda.preco_unitario)}</td><td><strong className="positive-value">{formatCurrency(venda.valor_total)}</strong></td></tr>)}</tbody></table></div>
              )
            ) : filteredResultados.length === 0 ? (
              <div className="table-state"><PackageOpen size={28} /><strong>Nenhum resultado encontrado</strong></div>
            ) : (
              <div className="table-scroll"><table><thead><tr><th>Animal</th><th>Custos</th><th>Venda do animal</th><th>Resultado</th><th>Situação</th></tr></thead><tbody>{filteredResultados.map((resultado) => <tr key={resultado.animal_id}><td><div className="animal-cell"><span className="animal-icon"><Scale size={19} /></span><span><strong>{resultado.nome_animal}</strong><small>#{resultado.animal_id} · {resultado.tipo_animal}</small></span></div></td><td>{formatCurrency(resultado.total_custos)}</td><td>{formatCurrency(resultado.total_vendas)}</td><td><strong className={Number(resultado.resultado) < 0 ? 'negative-value' : 'positive-value'}>{formatCurrency(resultado.resultado)}</strong></td><td><span className={`status-tag ${resultado.situacao}`}>{resultado.situacao === 'lucro' ? <TrendingUp size={13} /> : resultado.situacao === 'prejuizo' ? <TrendingDown size={13} /> : null}{resultado.situacao}</span></td></tr>)}</tbody></table></div>
            )}
          </div>
        </>
      )}

      {createOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false) }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="create-cost-title">
            <div className="dialog-header"><div><p className="eyebrow">Registro</p><h2 id="create-cost-title">Novo custo</h2></div><button className="icon-button" onClick={() => setCreateOpen(false)} title="Fechar" type="button"><X size={19} /></button></div>
            <form onSubmit={handleCreate}>
              <fieldset><legend>Escopo</legend><div className="segmented"><button className={costScope === 'geral' ? 'selected' : ''} onClick={() => setCostScope('geral')} type="button">Custo geral</button><button className={costScope === 'especifico' ? 'selected' : ''} onClick={() => setCostScope('especifico')} type="button">De um animal</button></div></fieldset>
              {costScope === 'especifico' && <label><span>Animal</span><select name="animalId" required autoFocus><option value="">Selecione um animal</option>{animals.map((animal) => <option key={animal.id} value={animal.id}>{animal.nome} · {animal.tipo} (#{animal.id})</option>)}</select></label>}
              <div className="form-grid"><label><span>Tipo</span><input name="tipo" required maxLength={50} autoFocus={costScope === 'geral'} placeholder="Ex.: ração, vacina, energia" /></label><label><span>Data</span><input name="data" type="date" required /></label></div>
              <label><span>Descrição <small>opcional</small></span><input name="descricao" /></label>
              <label><span>Valor</span><div className="money-input"><span>R$</span><input name="valor" type="number" min="0" max="99999999.99" step="0.01" required /></div></label>
              {formError && <div className="form-error"><CircleAlert size={16} /> {formError}</div>}
              <div className="dialog-actions"><button className="secondary-button" onClick={() => setCreateOpen(false)} type="button">Cancelar</button><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting && <LoaderCircle className="spin" size={17} />} Registrar custo</button></div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast"><CircleCheck size={18} /> {notice}</div>}
    </section>
  )
}

export default FinanceiroWorkspace
