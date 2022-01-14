<template>
    <el-row style="padding-bottom: 14px; font-size: 14px; font-weight: 600;" type="flex" align="top" >
        <el-col :span="24">
            <router-link :to="`/ifo/${project.tokenName}`">
            <div style=" border-radius: 14px; color: #8C8D8F; font-size: 16px">
                 <el-row :gutter="20" class="farm-row" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                    <el-col :span="7" style="font-weight: bold;">
                        <div class="logo-container">
                            <img :src="images[project.tokenLogo]" :alt="project.name"  style="height: 50px; width: 50px;"/> <span style="margin-left: 15px"> {{project.tokenName}} </span>
                        </div>
                        
                    </el-col> 
                    <el-col :span="7" style="font-weight: bold;">
                        <div > {{project.isIFO ? "Initial Farm Offering" : "Initial Dex Offering"}} </div>
                    </el-col> 
                    <el-col :span="5" style="font-weight: bold; text-align: right;">
                        {{vueNumberFormat(project.offeringSupply)}} {{project.tokenSymbol}}
                    </el-col> 
                    <el-col :span="5" style="font-weight: bold; text-align: right;">
                        <IFOTimeBubble :date="new Date(project.startTime)" :endDate="new Date(project.endTime)" />
                    </el-col> 
                 </el-row>
            </div>
            </router-link>
        </el-col>
    </el-row>
</template>

<script>
import IFOTimeBubble from './IFOTimeBubble.vue';
import {importAll} from '../lib/JsonHelper';

export default {
    
    name: "IFOListRow",
    data: ()=> ({
        images: importAll(require.context('../assets/project_images', false, /\.(png|jpe?g|svg)$/))
    }),
    components: { IFOTimeBubble },
    props: ['project'],

}
</script>
<style scoped>
    .accessType {
        display: inline-block;
        margin-right: 15px;
    }
    .logo-container {
        width: 50px;
        display: flex;
        justify-content: start;
        align-items: center;
    } 
</style>